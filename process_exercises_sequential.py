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

# Track unique exercises in the order they first appear
exercise_to_id = {}
next_id = 1

# First pass: assign IDs in the order exercises appear in the file
for row in rows:
    if row:  # Check if the row is not empty
        exercise_name = row[0]
        if exercise_name not in exercise_to_id:
            # Assign a sequential ID to the exercise
            exercise_to_id[exercise_name] = next_id
            next_id += 1

print(f"Found {len(exercise_to_id)} unique exercises")

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

# Print the first 10 exercises in order for verification
print("\nFirst 10 exercises in sequential order:")
exercises_by_id = sorted([(exercise_id, exercise) for exercise, exercise_id in exercise_to_id.items()])
for i, (exercise_id, exercise) in enumerate(exercises_by_id):
    if i < 10:
        print(f"ID: {exercise_id}, Exercise: {exercise}")
    else:
        break 