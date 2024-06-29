import re

def process_file(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f_in:
        with open(output_file, 'w', encoding='utf-8') as f_out:
            for line in f_in:
                # Use regular expression to extract the word part
                match = re.match(r'\d+\.\s+(\w+)', line)
                if match:
                    word = match.group(1)
                    f_out.write(word + '\n')

# Replace 'input.txt' and 'output.txt' with your file names
process_file('cities.txt', 'cities1.txt')