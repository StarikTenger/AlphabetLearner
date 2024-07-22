const validCombinations = ['дж', 'дз'];

function getNextIndex(i) {
    let nextIndex = i + 1;
    const georgianWord = document.getElementById('randomGeorgianWord').textContent;
    while (
        nextIndex < georgianWord.length && 
        (letterStats[georgianWord[nextIndex]].locked ||
        document.getElementById('input' + nextIndex).disabled)
    ) nextIndex++;

    return nextIndex;
}

function getPrevIndex(i) {
    let prevIndex = i - 1;
    const georgianWord = document.getElementById('randomGeorgianWord').textContent;
    while (
        prevIndex > 0 && 
        (letterStats[georgianWord[prevIndex]].locked ||
        document.getElementById('input' + prevIndex).disabled)
    ) prevIndex--;

    return prevIndex;
}

function generateInputFields(wordSize) {
    wordSize++;
    const inputContainer = document.getElementById('inputContainer');
    inputContainer.innerHTML = ''; // Clear previous input fields

    for (let i = 0; i < wordSize; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 2; // Allow only 1 character initially
        input.className = 'letter-input';
        input.id = 'input' + i;

        if (i === wordSize - 1) {
            input.className += ' invisible'; // Make the last input field invisible
        }

        // Event listener to move focus to the next input
        input.addEventListener('input', function() {
            console.log('input');
            const value = input.value.toLowerCase();
            input.value = value;
            let nextIndex = getNextIndex(i);

            if (nextIndex < wordSize && value != '') {
                const nextInput = document.getElementById('input' + nextIndex);
                nextInput.value = '';
                nextInput.focus();
            }

            if (i > 0) {
                let prevIndex = getPrevIndex(i);

                const prevInput = document.getElementById('input' + (prevIndex));
                const combinedValue = prevInput.value + value;

                if (validCombinations.includes(combinedValue)) {
                    prevInput.value = combinedValue;
                    input.value = '';
                    input.focus();
                }
            }
        });

        // Event listener to handle backspace key
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Backspace' && i > 0) {
                let prevIndex = getPrevIndex(i);

                console.log('backspace');
                const prevInput = document.getElementById('input' + prevIndex);
                //prevInput.value = prevInput.value[0] || ''; // Remove the second character if it exists
                input.value = '';
                prevInput.focus();
            }
        });

        // Event listener to handle backspace key
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' && i > 0) {
                console.log('enter');
                validateTransliteration();
            }
        });


        input.addEventListener('focus', function(event) {
            console.log(event);
            input.value = '';
        });

        inputContainer.appendChild(input);
    }
}