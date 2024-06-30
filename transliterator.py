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
    # Quickfix for dealing with empty words
    russian_text += ' ' * 20
    
    # Transliterate the Georgian text to Russian
    transliterated_georgian = translit_rev(russian_text)
    
    # Initialize lists for correctly and incorrectly transliterated letters
    correct_letters = []
    incorrect_letters = []
    
    # Check each letter and its transliteration
    for georgian_letter, transliterated_letter, russian_letter in \
        zip(georgian_text, transliterated_georgian, russian_text):
        # Yandere dev moment
        if transliterated_letter == georgian_letter or \
            georgian_letter == 'თ' and russian_letter == 'т' or \
            georgian_letter == 'ხ' and russian_letter == 'к' or \
            georgian_letter == 'ქ' and russian_letter == 'к' or \
            georgian_letter == 'კ' and russian_letter == 'к' or \
            georgian_letter == 'ჭ' and russian_letter == 'ч' or \
            georgian_letter == 'ც' and russian_letter == 'ц':
            correct_letters.append(georgian_letter)
        else:
            incorrect_letters.append(georgian_letter)
    
    return correct_letters, incorrect_letters