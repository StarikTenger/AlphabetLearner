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