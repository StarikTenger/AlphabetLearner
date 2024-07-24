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
let level = 0;

function saveLetterStatsToLocalStorage() {
    console.log("Saving to local storage");

    const json = JSON.stringify(letterStats, (key, value) => {
        if (value instanceof LetterInfo) {
            return value.toJSON();
        }
        return value;
    });
    localStorage.setItem('letterStats', json);
    localStorage.setItem('level', level);
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

    if (localStorage.getItem('level')) {
        level = localStorage.getItem('level');
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

function sortKeysByFrequency(letterInfoObj) {
    // Convert the object entries to an array
    const letterInfoEntries = Object.entries(letterInfoObj);

    // Sort the array by frequency
    letterInfoEntries.sort((a, b) => b[1].frequency - a[1].frequency);

    // Extract and return the sorted keys
    return letterInfoEntries.map(entry => entry[0]);
}