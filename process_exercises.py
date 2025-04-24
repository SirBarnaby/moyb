import csv

# Read the input CSV
input_file = 'app/src_db/MOYB-DB - muscle-in-exercise.csv'
output_file = 'app/src_db/MOYB-DB - muscle-in-exercise-with-ids.csv'

# Dictionary to store exercise names and their IDs
exercise_ids = {}
current_id = 1

# Read the input file and create the mapping
with open(input_file, 'r') as f:
    reader = csv.reader(f)
    header = next(reader)  # Skip header
    
    # First pass: create mapping of exercise names to IDs
    for row in reader:
        exercise_name = row[0]  # Get exercise name from first column
        if exercise_name not in exercise_ids:
            exercise_ids[exercise_name] = current_id
            current_id += 1

# Write the output file with IDs
with open(input_file, 'r') as f_in, open(output_file, 'w', newline='') as f_out:
    reader = csv.reader(f_in)
    writer = csv.writer(f_out)
    
    # Write header
    header = next(reader)
    writer.writerow(['id'] + header)
    
    # Write data rows with IDs
    for row in reader:
        exercise_name = row[0]  # Get exercise name from first column
        exercise_id = exercise_ids[exercise_name]
        writer.writerow([exercise_id] + row)

print(f"Processed {len(exercise_ids)} unique exercises")
print(f"Output written to {output_file}") 