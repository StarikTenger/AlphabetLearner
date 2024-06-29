def translit(georgian_text):
    # Define a dictionary for Georgian to Russian transliteration
    translit_dict_rev = {
        'ა': 'а', 'ბ': 'б', 'გ': 'г', 'დ': 'д', 'ე': 'е',
        'ვ': 'в', 'ზ': 'з', 'თ': 'т', 'ი': 'и', 'კ': 'к',
        'ლ': 'л', 'მ': 'м', 'ნ': 'н', 'ო': 'о', 'პ': 'п',
        'ჟ': 'ж', 'რ': 'р', 'ს': 'с', 'ტ': 'т', 'უ': 'у',
        'ფ': 'ф', 'ქ': 'к', 'ღ': 'г', 'ყ': 'к', 'შ': 'ш',
        'ჩ': 'ч', 'ც': 'ц', 'ძ': 'дз', 'წ': 'ц', 'ჭ': 'ч',
        'ხ': 'х', 'ჯ': 'дж', 'ჰ': 'х', 'ჱ': 'е', 'ჲ': 'и',
        'ჳ': 'ви', 'ჴ': 'х', 'ჵ': 'ое', 'ჶ': 'фи', 'ჷ': 'ў',
        'ჸ': 'о', 'ჹ': 'же', 'ჺ': 'зе', '჻': 'ш', 'ჼ': 'си',
        'ჽ': 'щ', 'ჾ': 'ща', 'ჿ': 'ха', 'ჽ': 'хв',
        'ы': 'ы', 'ю': 'ю', 'ია': 'я'
    }

    # Transliterate the text
    russian_text = ''.join([translit_dict_rev.get(char, char) for char in georgian_text])
    
    return russian_text

def translit_rev(russian_text):
    # Define a dictionary for Russian to Georgian transliteration
    translit_dict = {
        'а': 'ა', 'б': 'ბ', 'в': 'ვ', 'г': 'გ', 'д': 'დ',
        'е': 'ე', 'ж': 'ჟ', 'з': 'ზ', 'и': 'ი', 'й': 'ი',
        'к': 'კ', 'л': 'ლ', 'м': 'მ', 'н': 'ნ', 'о': 'ო',
        'п': 'პ', 'р': 'რ', 'с': 'ს', 'т': 'ტ', 'у': 'უ',
        'ф': 'ფ', 'х': 'ხ', 'ц': 'ც', 'ч': 'ჩ', 'ш': 'შ',
        'щ': 'შщ', 'ъ': '', 'ы': 'ი', 'ь': '', 'э': 'ე',
        'ю': 'ю', 'я': 'ია', 'дз': 'ძ', 'дж': 'ჯ',
    }
    
    # Handle multi-character combinations first
    multi_char_combinations = ['дз', 'дж']
    
    georgian_text = ""
    i = 0
    while i < len(russian_text):
        if i < len(russian_text) - 1 and russian_text[i:i+2] in multi_char_combinations:
            georgian_text += translit_dict[russian_text[i:i+2]]
            i += 2
        else:
            georgian_text += translit_dict.get(russian_text[i], russian_text[i])
            i += 1
    
    return georgian_text

def translit_double(russian_text):
    return translit(translit_rev(russian_text))


def is_correct_transliteration(georgian_text, russian_text):
    # Transliterate the Georgian text to Russian
    transliterated_georgian = translit_rev(russian_text)
    
    # Initialize lists for correctly and incorrectly transliterated letters
    correct_letters = []
    incorrect_letters = []
    
    # Check each letter and its transliteration
    for georgian_letter, transliterated_letter, russian_letter in \
        zip(georgian_text, transliterated_georgian, russian_text):
        if transliterated_letter == georgian_letter or \
            georgian_letter == 'თ' and russian_letter == 'т' or \
            georgian_letter == 'ხ' and russian_letter == 'к' or \
            georgian_letter == 'ქ' and russian_letter == 'к' or \
            georgian_letter == 'კ' and russian_letter == 'к':
            correct_letters.append(georgian_letter)
        else:
            incorrect_letters.append(georgian_letter)
    
    return correct_letters, incorrect_letters

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

    def evaluate_word(self):
        import random
        word = random.choice(self.words)
        print(f"Transliterate this Georgian word: {word}")
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

# Example usage
framework = Framework([])
framework.load_words("cities.txt")  # Replace with your actual file name
framework.evaluate_word()