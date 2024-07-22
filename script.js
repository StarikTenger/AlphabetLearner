"use strict";

function processWords() {
    for (let i = 0; i < georgianWords.length; i++) {
        let word = georgianWords[i];
        for (let j = 0; j < word.length; j++) {
            letterStats[word[j]].frequency++;
        }
    }
}

processWords();
let letterArray = sortKeysByFrequency(letterStats);

// Unlock n next letterss
function unlockNext(n) {
    level++;

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
    wordDisplay.innerHTML = '';

    let wordColored = '';
    for (let i = 0; i < randomWord.length; i++) {
        let letter = document.createElement('text');
        letter.innerHTML = randomWord[i];
        letter.id = 'letter' + i;
        if (letterStats[randomWord[i]].locked) {
            letter.style.color = '#cccccc';
        }
        wordDisplay.appendChild(letter);
    }

    // Clean user input
    //document.getElementById('textInput').value = "";

    generateInputFields(randomWord.length);
    focusFirstUnsolved();

    // Clean set of solved positions
    solved_positions = {};
    failed_positions = {};
    userInputPrev = '\0';

    // Display tip
    for (let i = 0; i < randomWord.length; i++) {
        const georgianLetter = randomWord[i];
        const expectedRussianLetter = transliterations.find(item => item.georgian === georgianLetter)?.russian;

        if (letterStats[georgianLetter].locked) {
            document.getElementById('input' + i).value = expectedRussianLetter;
            document.getElementById('input' + i).style['backgroundColor'] = '#aaaaaa';
            document.getElementById('input' + i).disabled = true;
        }
    }
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

checkNewLevel();

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
    document.getElementById('bar').style.width = (1 - acc / stepsForAll) * 100 + '%';
    document.getElementById('bar-outer').textContent = "Уровень " + level;
}

progressBar();

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

        if (!letter_correct) { // Incorrect
            errorMessage += `  ${georgianLetter} = ${expectedRussianLetter}, `;
            replaceWord += "_";
            document.getElementById('input' + i).value = '';
            
            if (!failed_positions[i]) {
                letterStats[georgianLetter].dec_rating();
                failed_positions[i] = true;
            }
        } else { // Correct
            replaceWord += expectedRussianLetter;

            if (!solved_positions[i] && !failed_positions[i]) {
                letterStats[georgianLetter].inc_rating();
                solved_positions[i] = true;
            }

            if (!letterStats[georgianLetter].locked) {
                document.getElementById('input' + i).style['backgroundColor'] = '#aaffaa';
                document.getElementById('input' + i).disabled = true;
                document.getElementById('letter' + i).style.color = '#aaffaa';
            }
        }

        isCorrect = isCorrect && letter_correct;
    }


    saveLetterStatsToLocalStorage();

    if (isCorrect) {
        successStreak++;

        let message = '';
        message += colorText('<b>Верно!</b>', 'green');
        if (successStreak > 1) {
            message += colorText(' x' + successStreak, '#00CC00');
        }
        message += '<br/>';
        message += '' + randomGeorgianWord + ' : '
        message += '' + replaceWord + '<br/>'

        log(message);
        
        checkNewLevel();
        displayRandomWord();
    } else {
        successStreak = 0;

        log_error(errorMessage);
        focusFirstUnsolved();
    }

    progressBar();
}

document.getElementById("resetButton").addEventListener("click", function() {
    if (confirm("Вы уверены, что хотите сбросить прогресс?")) {
        localStorage.clear();
        location.reload();
    }
});

displayRandomWord();