"use strict";

class LetterInfo {
    success_rate;
    fail_rate;
    raiting;
    cell; // In html table

    constructor(_cell) {
        this.success_rate = 0;
        this.fail_rate = 0;
        this.raiting = 0;
        this.cell = _cell;
        this.update_cell();
    }

    // Increment raiting
    inc_raiting() {
        this.success_rate++;
        //this.raiting += 1;
        //this.raiting = Math.floor(this.raiting);
        this.raiting = (this.raiting + 1) / 2;
        this.update_cell();
    }

    // Decrement raiting
    dec_raiting() {
        this.fail_rate++;
        this.raiting /= 2;
        //this.raiting = Math.floor(this.raiting);
        this.update_cell();
    }

    update_cell() {
        this.cell.innerHTML = '<b>' + Math.round(this.raiting * 100) + '</b>'; 
    }
}

let letterStats = {}

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

    letterStats[georgian] = new LetterInfo(row.insertCell(2));
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
    logEntry.innerHTML = text;
    if (color) {
        logEntry.style.color = color;
    }
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight; // Auto scroll to bottom
}

function logInput() {
    const input = document.getElementById('textInput').value;
    log(input);
}

function getRandomWord() {
    return georgianWords[Math.floor(Math.random() * georgianWords.length)];
}

function displayRandomWord() {
    const randomWord = getRandomWord();
    const wordDisplay = document.getElementById('randomGeorgianWord');
    if (wordDisplay) {
        wordDisplay.textContent = randomWord;
    }

    // Clean user input
    document.getElementById('textInput').value = "";
}

function validateTransliteration() {
    const userInput = document.getElementById('textInput').value.trim().toLowerCase();
    const randomGeorgianWord = document.getElementById('randomGeorgianWord').textContent;

    if (!userInput) {
        log_error('Please enter a transliteration.');
        return;
    }

    let isCorrect = true;
    let errorMessage = 'Not correct. Errors:';
    let i1 = 0;
    let replaceWord = "";

    for (let i = 0; i < randomGeorgianWord.length; i++) {
        const georgianLetter = randomGeorgianWord[i];
        const expectedRussianLetter = transliterations.find(item => item.georgian === georgianLetter)?.russian;

        let letter_correct = false;
        let letters_read = 1;
        for (; letters_read <= 2; letters_read++) {
            const actualRussianLetter = userInput.substring(i1, i1 + letters_read);
            if (expectedRussianLetter == actualRussianLetter) {
                letter_correct = true;
                replaceWord += actualRussianLetter;
                break;
            }
        }

        if (!letter_correct) {
            errorMessage += ` ${georgianLetter} should be ${expectedRussianLetter},`;
            i1++;
            replaceWord += "_";

            letterStats[georgianLetter].dec_raiting();
        } else {
            i1 += letters_read;
            letterStats[georgianLetter].inc_raiting();
        }

        isCorrect = isCorrect && letter_correct;
    }

    document.getElementById('textInput').value = replaceWord;

    if (isCorrect) {
        let message = '<div class="frame">';
        message += '<b>Correct!</b><br/>';
        message += '' + randomGeorgianWord + ' : '
        message += '' + replaceWord + '<br/>'
        message += '</div>';

        log(message);
        displayRandomWord();
    } else {
        log_error(errorMessage);
    }
}

displayRandomWord();