from transliterator import *
import random
import re

class Framework:
    def __init__(self, words=None):
        self.words = words if words else []
        self.georgian_alphabet = "აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ"
        self.letter_info = {letter: {'rating': 0, 'correct_count': 0, 'total_count': 0} for letter in self.georgian_alphabet}
        self.letter_to_word = {letter: set() for letter in self.georgian_alphabet}
        self.letter_raiting_boundary = 5

    def load_words(self, filename):
        with open(filename, 'r', encoding='utf-8') as file:
            loaded_words = [line.strip() for line in file.readlines()]
            
        for word in loaded_words:
            for letter in word:
                self.letter_to_word[letter].add(word)
            
        self.words.extend(loaded_words)
        print(f"Loaded {len(loaded_words)} words from {filename}")

    def format_word(self, word):
        return ' '.join(word)
    
    def find_lowest_rating_letter(self):
        if not self.letter_info:
            print("No letter information available.")
            return None
        
        lowest_rating_letter = min(self.letter_info.items(), key=lambda x: x[1]['rating'])
        return lowest_rating_letter[0], lowest_rating_letter[1]['rating']
    
    def pick_word(self):
        letter, _ = self.find_lowest_rating_letter()
        print(self.find_lowest_rating_letter())
        return random.choice(list(self.letter_to_word[letter]))
    
    def evaluate_word(self):
        # TODO: implement more intelligent word picker
        word = self.pick_word()
        
        print('\n--------------------------------')
        print(f"Transliterate this Georgian word: {self.format_word(word)}")
        user_input = input("Your transliteration:             ")
        user_input = re.sub(r'\s+', '', user_input)
        
        correct, incorrect = is_correct_transliteration(word, user_input)
        correct_transliteration = translit(word)
        
        for letter in correct:
            self.letter_info[letter]['rating'] += 1
            if self.letter_info[letter]['rating'] > self.letter_raiting_boundary:
                self.letter_info[letter]['rating'] = self.letter_raiting_boundary
            if self.letter_info[letter]['rating'] < -self.letter_raiting_boundary:
                self.letter_info[letter]['rating'] = -self.letter_raiting_boundary
                
            self.letter_info[letter]['correct_count'] += 1
            self.letter_info[letter]['total_count'] += 1
        
        for letter in incorrect:
            self.letter_info[letter]['rating'] -= 1
            if self.letter_info[letter]['rating'] > self.letter_raiting_boundary:
                self.letter_info[letter]['rating'] = self.letter_raiting_boundary
            if self.letter_info[letter]['rating'] < -self.letter_raiting_boundary:
                self.letter_info[letter]['rating'] = -self.letter_raiting_boundary
                
            self.letter_info[letter]['total_count'] += 1

        print(f"Correct transliteration: {correct_transliteration}")
        if incorrect:
            incorrect_letter_info = "\n".join([f"{letter} = {translit(letter)}" for letter in incorrect])
            print(f"{len(incorrect)} incorrect letters: \n{incorrect_letter_info}")
        else:
            print("All letters were correct!")
        
        self.display_letter_info()
    
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