import requests
import urllib3
from urllib.parse import quote
from bs4 import BeautifulSoup
import pandas as pd
import time
import logging

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def extract_coordinates(address: str):
    """
    Extract latitude and longitude from geocoding.jp
    """
    try:
        # URL encode the address
        url = f"https://www.geocoding.jp/?q={address}"
        
        # Add headers to mimic a browser request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # Disable SSL verification
        response = requests.get(url, headers=headers, timeout=10, verify=False)
        response.raise_for_status()
        
        # Parse HTML with BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find the result span
        result_span = soup.find('span', id='result')
        
        if result_span:
            # Look for the span with class "nowrap" that contains coordinates
            nowrap_spans = result_span.find_all('span', class_='nowrap')
            
            for span in nowrap_spans:
                span_text = span.get_text()
                if '緯度:' in span_text and '経度:' in span_text:
                    # Extract coordinates from the <b> tags
                    b_tags = span.find_all('b')
                    if len(b_tags) >= 2:
                        try:
                            latitude = float(b_tags[0].get_text().strip())
                            longitude = float(b_tags[1].get_text().strip())
                            return latitude, longitude
                        except ValueError:
                            logger.warning(f"Could not convert coordinates to float: {b_tags[0].get_text()}, {b_tags[1].get_text()}")
                            return None, None
        
        return None, None
            
    except Exception as e:
        logger.error(f"Error for {address}: {e}")
        return None, None

def main():
    # Read the CSV file
    try:
        df = pd.read_csv("PB.csv")
        logger.info(f"Loaded {len(df)} addresses from PB.csv")
    except FileNotFoundError:
        logger.error("PB.csv file not found!")
        return
    except Exception as e:
        logger.error(f"Error reading PB.csv: {e}")
        return
    
    # Initialize latitude and longitude columns
    df['latitude'] = None
    df['longitude'] = None
    
    # Process all addresses
    for index, row in df.iterrows():
        address = row['address']
        name = row['name']
        
        logger.info(f"Geocoding {index + 1}/{len(df)}: {name}")
        logger.info(f"Address: {address}")
        
        lat, lon = extract_coordinates(address)
        
        if lat is not None and lon is not None:
            df.at[index, 'latitude'] = lat
            df.at[index, 'longitude'] = lon
            logger.info(f"✓ Success: {name} -> ({lat:.6f}, {lon:.6f})")
        else:
            logger.warning(f"✗ Failed: {name}")
        
        # Add a delay to be respectful to the website
        time.sleep(2)
    
    # Save the results back to the original file
    df.to_csv("PB.csv", index=False)
    logger.info("Results saved to PB.csv")
    
    # Print summary
    successful_geocodes = df['latitude'].notna().sum()
    logger.info(f"Geocoding complete: {successful_geocodes}/{len(df)} addresses successfully geocoded")
    
    # Show a few examples
    print("\nSample results:")
    print(df[['name', 'address', 'latitude', 'longitude']].head())
    
    # Show failed geocodes if any
    failed_df = df[df['latitude'].isna()]
    if not failed_df.empty:
        print(f"\nFailed geocodes ({len(failed_df)}):")
        for _, row in failed_df.iterrows():
            print(f"  - {row['name']}: {row['address']}")

if __name__ == "__main__":
    main() 