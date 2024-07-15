"use strict";

function colorText(text, col) {
    return '<text style="color: ' + col + '"><b>' + 
            text + 
            '</b></text>'; 
}

class LetterInfo {
    success_rate;
    fail_rate;
    rating;
    cell; // In html table

    constructor(_cell) {
        this.success_rate = 0;
        this.fail_rate = 0;
        this.rating = 0;
        this.cell = _cell;
        this.update_cell();
    }

    // Increment rating
    inc_rating() {
        this.success_rate++;
        //this.rating += 1;
        //this.rating = Math.floor(this.rating);
        this.rating = (this.rating + 1) / 2;
        this.update_cell();
    }

    // Decrement rating
    dec_rating() {
        this.fail_rate++;
        this.rating /= 2;
        //this.rating = Math.floor(this.rating);
        this.update_cell();
    }

    update_cell() {
        let rating_normalized = Math.round(this.rating * 100);

        let col = '#BBBB00';
        if (rating_normalized < 30) {
            col = 'red';
        }

        if (rating_normalized > 70) {
            col = 'green';
        }

        this.cell.innerHTML = 
            colorText(rating_normalized, col);
    }

    toJSON() {
        return {
            success_rate: this.success_rate,
            fail_rate: this.fail_rate,
            rating: this.rating,
        };
    }
}

let letterStats = {}

function saveLetterStatsToLocalStorage() {
    console.log("Saving to local storage");

    const json = JSON.stringify(letterStats, (key, value) => {
        if (value instanceof LetterInfo) {
            return value.toJSON();
        }
        return value;
    });
    localStorage.setItem('letterStats', json);
}

function loadLetterStatsFromLocalStorage() {
    console.log("Loading from local storage");

    const json = localStorage.getItem('letterStats');
    if (!json) {
        return {};
    }

    const parsed = JSON.parse(json);

    for (const key in parsed) {
        if (parsed.hasOwnProperty(key)) {
            console.log(key);
            console.log(letterStats[key]);
            console.log(parsed[key]);
            if (letterStats[key].rating != undefined) {
                letterStats[key].rating = parsed[key].rating;
            }
            letterStats[key].success_rate = parsed[key].success_rate;
            letterStats[key].fail_rate = parsed[key].fail_rate;
            console.log(letterStats[key]);

            letterStats[key].update_cell();
        }
    }

}



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

loadLetterStatsFromLocalStorage();



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

// The average difficulty of the letter
function wordDifficulty(word) {
    let ratingAvg = 0;
    for (let i = 0; i < word.length; i++) {
        ratingAvg += letterStats[word[i]].rating;
    }
    ratingAvg /= word.length;

    return 1 - ratingAvg;
}

function pickWord() {
    // Politics: pick some words, take the hardest
    let chosenWord = '';
    let wordsNumber = 20;
    let peakDifficulty = -1;

    for (let i = 0; i < wordsNumber; i++) {
        let currentWord = 
            georgianWords[Math.floor(Math.random() * georgianWords.length)];
        let currentDiff = wordDifficulty(currentWord);
        if (currentDiff > peakDifficulty) {
            peakDifficulty = currentDiff;
            chosenWord = currentWord;
        }
    }

    console.log(peakDifficulty);
    return chosenWord;

    // georgianWords[Math.floor(Math.random() * georgianWords.length)];
}

// Set of positions in the word for which letter is already correctly guessed
let solved_positions = {};
let failed_positions = {};

let userInputPrev = '\0';

function displayRandomWord() {
    const randomWord = pickWord();
    const wordDisplay = document.getElementById('randomGeorgianWord');
    if (wordDisplay) {
        wordDisplay.textContent = randomWord;
    }

    // Clean user input
    document.getElementById('textInput').value = "";

    // Clean set of solved positions
    solved_positions = {};
    failed_positions = {};
    userInputPrev = '\0';
}

let successStreak = 0;

function validateTransliteration() {
    const userInput = document.getElementById('textInput').value.trim().toLowerCase();
    if (userInput == userInputPrev) {
        userInputPrev = userInput;
        return;
    }
    userInputPrev = userInput;

    const randomGeorgianWord = document.getElementById('randomGeorgianWord').textContent;

    if (!userInput) {
        log_error('Введите текст.');
        return;
    }

    let isCorrect = true;
    let errorMessage = 'Исправьте следующие буквы: <br/>';
    let i1 = 0; // Scanning position in russian word
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
            errorMessage += `  ${georgianLetter} = ${expectedRussianLetter}, `;
            i1++;
            replaceWord += "_";
            
            if (!failed_positions[i]) {
                letterStats[georgianLetter].dec_rating();
                failed_positions[i] = true;
            }
        } else {
            i1 += letters_read;

            if (!solved_positions[i] && !failed_positions[i]) {
                letterStats[georgianLetter].inc_rating();
                solved_positions[i] = true;
            }
        }

        isCorrect = isCorrect && letter_correct;
    }

    saveLetterStatsToLocalStorage();
    document.getElementById('textInput').value = replaceWord;

    if (isCorrect) {
        successStreak++;

        let message = '<div class="frame">';
        message += colorText('<b>Верно!</b>', 'green');
        if (successStreak > 1) {
            message += colorText(' x' + successStreak, '#00CC00');
        }
        message += '<br/>';
        message += '' + randomGeorgianWord + ' : '
        message += '' + replaceWord + '<br/>'
        message += '</div>';

        log(message);
        displayRandomWord();
    } else {
        successStreak = 0;

        log_error(errorMessage);
    }
}

displayRandomWord();