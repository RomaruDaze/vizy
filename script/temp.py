import pandas as pd

# def fix_pb_csv():
#     # Read the CSV file with a more flexible approach
#     try:
#         # First, let's read the file as text to see the actual format
#         with open('temp.csv', 'r', encoding='utf-8') as f:
#             lines = f.readlines()
        
#         print(f"Total lines: {len(lines)}")
#         print("First few lines:")
#         for i in range(min(5, len(lines))):
#             print(f"Line {i+1}: {lines[i].strip()}")
        
#         print("\nLine 62 (where format changes):")
#         if len(lines) > 61:
#             print(f"Line 62: {lines[61].strip()}")
        
#         # Process each line to extract name and address
#         cleaned_data = []
        
#         for i, line in enumerate(lines):
#             line = line.strip()
#             if not line:  # Skip empty lines
#                 continue
                
#             # Split by tab first (for lines 62+)
#             if '\t' in line:
#                 parts = line.split('\t')
#                 if len(parts) >= 2:
#                     name = parts[0].strip()
#                     address = parts[1].strip()
#                     cleaned_data.append([name, address])
#             # Split by comma (for lines 1-61)
#             elif ',' in line:
#                 parts = line.split(',')
#                 if len(parts) >= 2:
#                     name = parts[0].strip()
#                     address = parts[1].strip()
#                     cleaned_data.append([name, address])
        
#         # Create new DataFrame
#         df_cleaned = pd.DataFrame(cleaned_data, columns=['name', 'address'])
        
#         print(f"\nCleaned data shape: {df_cleaned.shape}")
#         print("\nSample cleaned data:")
#         print(df_cleaned.head(10))
        
#         # Save the cleaned data
#         df_cleaned.to_csv('PB_cleaned.csv', index=False)
#         print(f"\nCleaned data saved to PB_cleaned.csv")
        
#         # Also save back to original file
#         df_cleaned.to_csv('PB.csv', index=False)
#         print("Original PB.csv updated with cleaned format")
        
#     except Exception as e:
#         print(f"Error: {e}")

# if __name__ == "__main__":
#     fix_pb_csv() 


df = pd.read_csv('PB.csv')

df.drop(columns=['lat', 'lon'], inplace=True)

df.to_csv('PB.csv', index=False)