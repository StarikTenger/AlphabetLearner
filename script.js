"use strict";

function colorText(text, col) {
    return '<text style="color: ' + col + '"><b>' + 
            text + 
            '</b></text>'; 
}

let letterThreshold = 0.95;

class LetterInfo {
    success_rate;
    fail_rate;
    rating;
    locked; // If locked, tip is displayed 
    cell; // In html table
    frequency;

    constructor(_cell) {
        this.success_rate = 0;
        this.fail_rate = 0;
        this.rating = 0;
        this.locked = true;
        this.frequency = 0;
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

        let col = '#FFBB00';
        if (rating_normalized < 30) {
            col = 'red';
        }

        if (rating_normalized > 70) {
            col = '#BBBB00';
        }

        if (rating_normalized > letterThreshold * 100) {
            col = 'green';
        }

        if (this.locked) {
            this.rating = 0;
            this.cell.innerHTML = colorText('🔒', 'brown');
        } else {
            this.cell.innerHTML = colorText(rating_normalized, col);
        }
    }

    unlock() {
        this.rating = 0;
        this.locked = false;
        this.update_cell();
    }

    toJSON() {
        return {
            success_rate: this.success_rate,
            fail_rate: this.fail_rate,
            rating: this.rating,
            locked: this.locked,
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
            if (parsed[key].rating != undefined) {
                letterStats[key].rating = parsed[key].rating;
            }
            letterStats[key].success_rate = parsed[key].success_rate;
            letterStats[key].fail_rate = parsed[key].fail_rate;
            if (parsed[key].locked != undefined) {
                letterStats[key].locked = parsed[key].locked;
                console.log('aaa');
            }
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


// Initilaize letters

transliterations.forEach(({ georgian, russian }) => {
    const row = table.insertRow();
    const georgianCell = row.insertCell(0);
    const russianCell = row.insertCell(1);

    georgianCell.textContent = georgian;
    russianCell.textContent = russian;

    letterStats[georgian] = new LetterInfo(row.insertCell(2));
});

loadLetterStatsFromLocalStorage();

function processWords() {
    for (let i = 0; i < georgianWords.length; i++) {
        let word = georgianWords[i];
        for (let j = 0; j < word.length; j++) {
            letterStats[word[j]].frequency++;
        }
    }
}

processWords();

function sortKeysByFrequency(letterInfoObj) {
    // Convert the object entries to an array
    const letterInfoEntries = Object.entries(letterInfoObj);

    // Sort the array by frequency
    letterInfoEntries.sort((a, b) => b[1].frequency - a[1].frequency);

    // Extract and return the sorted keys
    return letterInfoEntries.map(entry => entry[0]);
}

let letterArray = sortKeysByFrequency(letterStats);

// Unlock n next letterss
function unlockNext(n) {
    let i = 0;
    for (; i < letterArray.length; i++) {
        if (letterStats[letterArray[i]].locked) {
            break;
        }
    }

    let message = 'Разблокированы новые буквы! <br/>';

    for (let j = i; j < i + n; j++) {
        if (j >= letterArray.length) {
            console.log('unlocked all leters', j);
            break;
        }
        letterStats[letterArray[j]].unlock();

        message += letterArray[j] + ' = ' + transliterations.find(item => item.georgian === letterArray[j])?.russian + ', ';
    }

    log(colorText(message, 'green'));
}

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
    let count = 0;
    for (let i = 0; i < word.length; i++) {
        if (!letterStats[word[i]].locked) {
            ratingAvg += letterStats[word[i]].rating;
            count++;
        }
    }
    ratingAvg /= count;

    return 1 - ratingAvg;
}

let wordLastOccurence = {};

for (let i = 0; i < georgianWords.length; i++) {
    wordLastOccurence[georgianWords[i]] = 100;
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
        if (currentDiff > peakDifficulty && wordLastOccurence[currentWord] > 4) {
            peakDifficulty = currentDiff;
            chosenWord = currentWord;
        }
    }

    console.log(peakDifficulty);

    for (let i = 0; i < georgianWords.length; i++) {
        wordLastOccurence[georgianWords[i]]++;
    }
    wordLastOccurence[chosenWord] = 0;

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

    let wordColored = '';
    for (let i = 0; i < randomWord.length; i++) {
        if (letterStats[randomWord[i]].locked) {
            wordColored += colorText(randomWord[i], '#cccccc');
        } else {
            wordColored += randomWord[i];
        }
    }

    if (wordDisplay) {
        wordDisplay.innerHTML = wordColored;
    }

    // Clean user input
    //document.getElementById('textInput').value = "";

    generateInputFields(randomWord.length);
    document.getElementById('input' + getNextIndex(-1)).focus();

    // Clean set of solved positions
    solved_positions = {};
    failed_positions = {};
    userInputPrev = '\0';

    // Display tip
    let tipMessage = 'Подсказка: <br>';
    for (let i = 0; i < randomWord.length; i++) {
        const georgianLetter = randomWord[i];
        const expectedRussianLetter = transliterations.find(item => item.georgian === georgianLetter)?.russian;

        if (letterStats[georgianLetter].locked) {
            tipMessage += georgianLetter + ' = ' + expectedRussianLetter;
            if (i != randomWord.length - 1) {
                tipMessage += ', ';
            }
            document.getElementById('input' + i).value = expectedRussianLetter;
            document.getElementById('input' + i).style['backgroundColor'] = '#aaaaaa';
            document.getElementById('input' + i).disabled = true;
        }
    }
    log(colorText(tipMessage, '#0055AA'));
    console.log(tipMessage);
}

function checkNewLevel() {
    for (let i = 0; i < letterArray.length; i++) {
        if (!letterStats[letterArray[i]].locked && 
            letterStats[letterArray[i]].rating < letterThreshold) {
                return;
            }
    }

    unlockNext(5);
}

let successStreak = 0;

if (letterStats[letterArray[0]].locked) {
    unlockNext(5);
}

function findLowestRatedUnlockedLetters() {
    // Filter out locked letters
    let unlockedLetters = Object.keys(letterStats).filter(letter => !letterStats[letter].locked);
    
    // Sort unlocked letters by rating
    unlockedLetters.sort((a, b) => letterStats[a].rating - letterStats[b].rating);
    
    // Get the 5 letters with the lowest rating
    let lowestRatedLetters = unlockedLetters.slice(0, 5);
    //let lowestRatedLetters = unlockedLetters;
    
    return lowestRatedLetters;
}

function calcSteps(x) {
    if (x > letterThreshold) {
        x = letterThreshold;
    }
    return Math.ceil(Math.log2((1 - x) / (1 - letterThreshold)));
}

function progressBar() {
    let letters = findLowestRatedUnlockedLetters();
    let stepsForAll = calcSteps(0) * letters.length;

    let acc = 0;
    for (let i = 0; i < letters.length; i++) {
        acc += calcSteps(letterStats[letters[i]].rating);
        console.log(letters[i], calcSteps(letterStats[letters[i]].rating));
    }

    console.log('acc =', acc);
    console.log('stepsForAll =', stepsForAll);
    document.getElementById('bar').value = (1 - acc / stepsForAll) * 100;
}

progressBar();

function getLetterFromInput(i) {
    return document.getElementById('input' + i).value;
}

function validateTransliteration() {
    console.log("validate");


    const randomGeorgianWord = document.getElementById('randomGeorgianWord').textContent;

    let isCorrect = true;
    let errorMessage = 'Исправьте следующие буквы: <br/>';
    let replaceWord = "";


    // Correctness check
    for (let i = 0; i < randomGeorgianWord.length; i++) {
        const georgianLetter = randomGeorgianWord[i];
        const expectedRussianLetter = transliterations.find(item => item.georgian === georgianLetter)?.russian;

        let letter_correct = getLetterFromInput(i) === expectedRussianLetter;

        if (!letter_correct) {
            errorMessage += `  ${georgianLetter} = ${expectedRussianLetter}, `;
            replaceWord += "_";
            
            if (!failed_positions[i]) {
                letterStats[georgianLetter].dec_rating();
                failed_positions[i] = true;
            }
        } else {

            if (!solved_positions[i] && !failed_positions[i]) {
                letterStats[georgianLetter].inc_rating();
                solved_positions[i] = true;
            }

            if (!letterStats[georgianLetter].locked) {
                document.getElementById('input' + i).style['backgroundColor'] = '#aaffaa';
                document.getElementById('input' + i).disabled = true;
            }
        }

        isCorrect = isCorrect && letter_correct;
    }


    saveLetterStatsToLocalStorage();

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
        
        checkNewLevel();
        displayRandomWord();
    } else {
        successStreak = 0;

        log_error(errorMessage);
    }

    progressBar();
}

displayRandomWord();