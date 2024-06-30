from transliterator import *

class Framework:
    def __init__(self, words=None):
        self.words = words if words else []
        self.georgian_alphabet = "აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ"
        self.letter_info = {letter: {'rating': 0, 'correct_count': 0, 'total_count': 0} for letter in self.georgian_alphabet}

    def load_words(self, filename):
        with open(filename, 'r', encoding='utf-8') as file:
            loaded_words = [line.strip() for line in file.readlines()]
        self.words.extend(loaded_words)
        print(f"Loaded {len(loaded_words)} words from {filename}")

    def format_word(self, word):
        return ' '.join(word)
    
    def evaluate_word(self):
        import random
        word = random.choice(self.words)
        print('\n--------------------------------')
        print(f"Transliterate this Georgian word: {self.format_word(word)}")
        user_input = input("Your transliteration:             ")
        
        correct, incorrect = is_correct_transliteration(word, user_input)
        correct_transliteration = translit(word)
        
        for letter in correct:
            self.letter_info[letter]['rating'] += 1
            self.letter_info[letter]['correct_count'] += 1
            self.letter_info[letter]['total_count'] += 1
        
        for letter in incorrect:
            self.letter_info[letter]['rating'] -= 1
            self.letter_info[letter]['total_count'] += 1

        print(f"Correct transliteration: {correct_transliteration}")
        if incorrect:
            incorrect_letter_info = ", ".join([f"{letter} = {translit(letter)}" for letter in incorrect])
            print(f"{len(incorrect)} incorrect letters: {incorrect_letter_info}")
        else:
            print("All letters were correct!")
        
        #self.display_letter_info()
    
    def display_letter_info(self):
        for letter, info in self.letter_info.items():
            correct_rate = (info['correct_count'] / info['total_count']) if info['total_count'] > 0 else 0
            print(f"Letter: {letter}, Rating: {info['rating']}, Correctness Rate: {correct_rate:.2f}")
            
    def run(self):
        self.load_words("cities.txt") 
        while True:
            self.evaluate_word()

# Example usage
framework = Framework([])
framework.run()