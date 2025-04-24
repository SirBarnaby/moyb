import csv

# Input and output file paths
input_file = 'app/src_db/MOYB-DB - muscle-in-exercise.csv'
output_file = 'app/src_db/MOYB-DB - muscle-in-exercise-with-ids.csv'

print(f"Reading file: {input_file}")

# First, load all data from the CSV file
with open(input_file, 'r') as csvfile:
    csv_reader = csv.reader(csvfile)
    header = next(csv_reader)  # Get header
    rows = list(csv_reader)    # Read all data rows into a list

# Extract unique exercise names
unique_exercises = set()
for row in rows:
    if row:  # Check if the row is not empty
        exercise_name = row[0]
        unique_exercises.add(exercise_name)

# Sort the unique exercise names to ensure consistent ordering
sorted_exercises = sorted(unique_exercises)

# Create a mapping from exercise name to ID
exercise_to_id = {}
for idx, exercise in enumerate(sorted_exercises):
    exercise_to_id[exercise] = idx + 1

print(f"Found {len(unique_exercises)} unique exercises")

# Write the output file with IDs
with open(output_file, 'w', newline='') as csvfile:
    csv_writer = csv.writer(csvfile)
    
    # Write header with 'id' as the first column
    csv_writer.writerow(['id'] + header)
    
    # Write rows with IDs
    for row in rows:
        if row:  # Check if the row is not empty
            exercise_name = row[0]
            exercise_id = exercise_to_id[exercise_name]
            csv_writer.writerow([exercise_id] + row)

print(f"Output written to {output_file}")

# Print some verification information
print("\nVerification:")
print(f"Total unique exercises: {len(unique_exercises)}")

# Print a sample of the exercise-ID mapping
print("\nSample of ID-exercise mapping (first 10):")
sample_count = 0
for exercise, exercise_id in exercise_to_id.items():
    print(f"ID: {exercise_id}, Exercise: {exercise}")
    sample_count += 1
    if sample_count >= 10:
        break 