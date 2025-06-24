import csv
import json
import os
from typing import List, Dict, Any

def csv_to_json(csv_file_path: str, json_file_path: str = None, encoding: str = 'utf-8') -> Dict[str, Any]:
    """
    Convert CSV file to JSON format.
    
    Args:
        csv_file_path (str): Path to the input CSV file
        json_file_path (str): Path to the output JSON file (optional)
        encoding (str): File encoding (default: 'utf-8')
    
    Returns:
        Dict[str, Any]: The converted JSON data
    """
    data = []
    
    try:
        with open(csv_file_path, 'r', encoding=encoding) as csv_file:
            # Read CSV file
            csv_reader = csv.DictReader(csv_file)
            
            # Convert each row to a dictionary
            for row in csv_reader:
                # Convert numeric values where possible
                processed_row = {}
                for key, value in row.items():
                    # Try to convert to float if it looks like a number
                    if value and value.replace('.', '').replace('-', '').isdigit():
                        try:
                            processed_row[key] = float(value)
                        except ValueError:
                            processed_row[key] = value
                    else:
                        processed_row[key] = value
                
                data.append(processed_row)
        
        # Create the final JSON structure
        json_data = {
            "source": os.path.basename(csv_file_path),
            "total_records": len(data),
            "data": data
        }
        
        # Save to JSON file if path is provided
        if json_file_path:
            with open(json_file_path, 'w', encoding='utf-8') as json_file:
                json.dump(json_data, json_file, ensure_ascii=False, indent=2)
            print(f"✅ Successfully converted {csv_file_path} to {json_file_path}")
            print(f"📊 Total records: {len(data)}")
        
        return json_data
        
    except FileNotFoundError:
        print(f"❌ Error: File '{csv_file_path}' not found")
        return {}
    except Exception as e:
        print(f"❌ Error converting CSV to JSON: {str(e)}")
        return {}

def convert_multiple_csv_files(csv_directory: str = ".", output_directory: str = None) -> None:
    """
    Convert all CSV files in a directory to JSON format.
    
    Args:
        csv_directory (str): Directory containing CSV files
        output_directory (str): Directory to save JSON files (optional)
    """
    if output_directory and not os.path.exists(output_directory):
        os.makedirs(output_directory)
    
    csv_files = [f for f in os.listdir(csv_directory) if f.endswith('.csv')]
    
    if not csv_files:
        print(f"❌ No CSV files found in {csv_directory}")
        return
    
    print(f"🔍 Found {len(csv_files)} CSV file(s) to convert:")
    
    for csv_file in csv_files:
        csv_path = os.path.join(csv_directory, csv_file)
        json_filename = csv_file.replace('.csv', '.json')
        
        if output_directory:
            json_path = os.path.join(output_directory, json_filename)
        else:
            json_path = os.path.join(csv_directory, json_filename)
        
        print(f"\n📄 Converting {csv_file}...")
        csv_to_json(csv_path, json_path)

def preview_csv_structure(csv_file_path: str, num_rows: int = 5) -> None:
    """
    Preview the structure of a CSV file.
    
    Args:
        csv_file_path (str): Path to the CSV file
        num_rows (int): Number of rows to preview
    """
    try:
        with open(csv_file_path, 'r', encoding='utf-8') as csv_file:
            csv_reader = csv.DictReader(csv_file)
            
            print(f"📋 CSV Structure Preview for: {csv_file_path}")
            print(f"📊 Headers: {list(csv_reader.fieldnames)}")
            print(f"📄 First {num_rows} rows:")
            print("-" * 50)
            
            for i, row in enumerate(csv_reader):
                if i >= num_rows:
                    break
                print(f"Row {i+1}: {dict(row)}")
                
    except Exception as e:
        print(f"❌ Error previewing CSV: {str(e)}")

# Example usage and main execution
if __name__ == "__main__":
    import sys
    
    # Check if command line arguments are provided
    if len(sys.argv) > 1:
        csv_file = sys.argv[1]
        json_file = sys.argv[2] if len(sys.argv) > 2 else None
        
        if json_file is None:
            json_file = csv_file.replace('.csv', '.json')
        
        print(f"🔄 Converting {csv_file} to {json_file}")
        result = csv_to_json(csv_file, json_file)
        
        if result:
            print("✅ Conversion completed successfully!")
    else:
        # Default behavior: convert all CSV files in the current directory
        print("🔄 Converting all CSV files in the current directory...")
        convert_multiple_csv_files()
        
        # Example: Convert specific files
        print("\n" + "="*50)
        print("📝 Example usage:")
        print("python json-maker.py IO.csv")
        print("python json-maker.py PB.csv")
        print("python json-maker.py input.csv output.json")