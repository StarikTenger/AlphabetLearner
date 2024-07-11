// script.js

const transliterations = [
    { georgian: 'ა', russian: 'а' },
    { georgian: 'ბ', russian: 'б' },
    { georgian: 'გ', russian: 'г' },
    { georgian: 'დ', russian: 'д' },
    { georgian: 'ე', russian: 'е' },
    { georgian: 'ვ', russian: 'в' },
    { georgian: 'ზ', russian: 'з' },
    { georgian: 'თ', russian: 'т' },
    { georgian: 'ი', russian: 'и' },
    { georgian: 'კ', russian: 'к' },
    { georgian: 'ლ', russian: 'л' },
    { georgian: 'მ', russian: 'м' },
    { georgian: 'ნ', russian: 'н' },
    { georgian: 'ო', russian: 'о' },
    { georgian: 'პ', russian: 'п' },
    { georgian: 'ჟ', russian: 'ж' },
    { georgian: 'რ', russian: 'р' },
    { georgian: 'ს', russian: 'с' },
    { georgian: 'ტ', russian: 'т' },
    { georgian: 'უ', russian: 'у' },
    { georgian: 'ფ', russian: 'ф' },
    { georgian: 'ქ', russian: 'к' },
    { georgian: 'ღ', russian: 'г' },
    { georgian: 'ყ', russian: 'к' },
    { georgian: 'შ', russian: 'ш' },
    { georgian: 'ჩ', russian: 'ч' },
    { georgian: 'ც', russian: 'ц' },
    { georgian: 'ძ', russian: 'дз' },
    { georgian: 'წ', russian: 'ц' },
    { georgian: 'ჭ', russian: 'ч' },
    { georgian: 'ხ', russian: 'х' },
    { georgian: 'ჯ', russian: 'дж' },
    { georgian: 'ჰ', russian: 'х' }
];

const table = document.getElementById('transliterationTable');

transliterations.forEach(({ georgian, russian }) => {
    const row = table.insertRow();
    const georgianCell = row.insertCell(0);
    const russianCell = row.insertCell(1);

    georgianCell.textContent = georgian;
    russianCell.textContent = russian;
});

function log(text) {
    writeToLog(text, '');
}

function log_warning(text) {
    writeToLog(text, 'yellow');
}

function log_error(text) {
    writeToLog(text, 'red');
}

function writeToLog(text, color) {
    const logContainer = document.getElementById('logContainer');
    const logEntry = document.createElement('p');
    logEntry.textContent = text;
    if (color) {
        logEntry.style.color = color;
    }
    logContainer.appendChild(logEntry);
}

function logInput() {
    const input = document.getElementById('textInput').value;
    log(input);
}

const georgianWords = [
    'გამარჯობა', // Hello
    'მადლობა',   // Thank you
    'დიდი',       // Big
    'გმადლობთ',   // Goodbye
    'სამშობლო',   // Family
    'დღეს',       // Today
    'მეგობრის',   // Friend's
    'რამდენი',    // How many
    'მიწო',       // Earth
    'პატარა',     // Small
];

function getRandomWord() {
    return georgianWords[Math.floor(Math.random() * georgianWords.length)];
}

function displayRandomWord() {
    const randomWord = getRandomWord();
    const wordDisplay = document.getElementById('randomGeorgianWord');
    if (wordDisplay) {
        wordDisplay.textContent = randomWord;
    }
}

function validateTransliteration() {
    const userInput = document.getElementById('textInput').value.trim();
    const randomGeorgianWord = document.getElementById('randomGeorgianWord').textContent;

    if (!userInput) {
        log_error('Please enter a transliteration.');
        return;
    }

    let isCorrect = true;
    let errorMessage = 'Not correct. Errors:';
    for (let i = 0; i < randomGeorgianWord.length; i++) {
        const georgianLetter = randomGeorgianWord[i];
        const expectedRussianLetter = transliterations.find(item => item.georgian === georgianLetter)?.russian;
        const actualRussianLetter = userInput[i];

        if (expectedRussianLetter !== actualRussianLetter) {
            isCorrect = false;
            errorMessage += ` ${georgianLetter} should be ${expectedRussianLetter},`;
        }
    }

    if (isCorrect) {
        log('All correct');
        displayRandomWord();
    } else {
        log_error(errorMessage);
    }
}

displayRandomWord();
log_warning("WARNING")
log_error("ERROR")