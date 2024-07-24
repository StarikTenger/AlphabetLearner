"use strict";

function colorText(text, col) {
    return '<text style="color: ' + col + '"><b>' + 
            text + 
            '</b></text>'; 
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
    logContainer.innerHTML = '';
    logEntry.innerHTML = text;
    if (color) {
        logEntry.style.color = color;
    }
    logContainer.appendChild(logEntry);
    
}

function logInput() {
    const input = document.getElementById('textInput').value;
    log(input);
}

function getLetterFromInput(i) {
    return document.getElementById('input' + i).value;
}

function capitalizeFirstLetter(string) {
    if (string.length === 0) {
        return string; // Return the string as-is if it's empty
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}