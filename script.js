//CONSTANTS////////////////////////////////////////////////////////////////////

//Maps a keybind to its corresponding note
const key_binds = new Map([['1', 'Gb2'], ['q', 'G2'], ['2', 'Ab2'],
    ['w', 'A2'], ['3', 'Bb2'], ['e', 'B2'], ['r', 'C3'], ['5', 'Db3'],
    ['t', 'D3'], ['6', 'Eb3'], ['y', 'E3'], ['u', 'F3'], ['8', 'Gb3'],
    ['i', 'G3'], ['9', 'Ab3'], ['o', 'A3'], ['p', 'B3'], ['0', 'Bb3'],
    ['[', 'C4'], ['=', 'Db4'], ['z', 'D4'], ['s', 'Eb4'], ['x', 'E4'],
    ['c', 'F4'], ['f', 'Gb4'], ['v', 'G4'], ['g', 'Ab4'], ['b', 'A4'],
    ['h', 'Bb4'], ['n', 'B4'], ['m', 'C5'], ['k', 'Db5'], [',', 'D5'],
    ['l', 'Eb5'], ['.', 'E5'], ['/', 'F5'], ['\'', 'Gb5']]);

//every note on the piano from lowest to highest
const notes = ['A1', 'Bb1', 'B1', 'C2', 'Db2', 'D2', 'Eb2', 'E2', 'F2', 'Gb2',
    'G2', 'Ab2', 'A2', 'Bb2', 'B2', 'C3', 'Db3', 'D3', 'Eb3', 'E3', 'F3',
    'Gb3', 'G3', 'Ab3', 'A3', 'Bb3', 'B3', 'C4', 'Db4', 'D4', 'Eb4', 'E4',
    'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5', 'Db5', 'D5', 'Eb5',
    'E5', 'F5', 'Gb5', 'G5', 'Ab5', 'A5', 'Bb5', 'B5', 'C6'];

const true_notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

//where 2 is the highest note and 32 is the lowest, ledger_lines represents the
//notes that have a ledger line attached to them.
const ledger_lines = [2, 4, 16, 28, 30, 32];

const CANVAS_HEIGHT = 800;
const CANVAS_WIDTH = 200;

///////////////////////////////////////////////////////////////////////////////

//GLOBALS//////////////////////////////////////////////////////////////////////
let keys_selected = new Map()
let mousedown = false
let keydown = false
///////////////////////////////////////////////////////////////////////////////

//set up website
pad_black_keys();
redraw_staff();

window.addEventListener('mouseup', (event) => {
        keys_selected.forEach((audio, key_selected) => {
            key_selected.parentElement.classList.remove('selected_key');
        })
        remove_all_flats();
        keys_selected.clear();
        mousedown = false;
        redraw_staff();
    })
window.addEventListener('keydown', keydown_listener);
window.addEventListener('keyup', keyup_listener)
    
const keys = document.querySelectorAll('.black_key, .white_key');
keys.forEach(function(key) {
    key.addEventListener('mousedown', (event) => {
        press_key(key);
        mousedown = true;
    })
    key.addEventListener('mouseenter', (event) => {
        if (mousedown) {
            press_key(key);
        }
    })
})

function keydown_listener(event) {
    if (key_binds.has(event.key)) {
        key = document.getElementById(key_binds.get(event.key));
        if (keys_selected.has(key)) {
            return;
        }
        press_key(key);
    }
}

function keyup_listener(event) {
    if (key_binds.has(event.key))  {
        key = document.getElementById(key_binds.get(event.key));
        key.parentElement.classList.remove('selected_key');
        keys_selected.delete(key);
        const flats = document.getElementsByClassName("flat");
        for (let flat of flats) {
            if (flat.id.includes(key.id)) {
                flat.remove();
            }
        }
        redraw_staff();
    }
}

/**
 * Plays the key sound, draws it on the staff and presses the key down.
 * @param {*} key : an element either belonging to the black_key or white_key class
 */
function press_key(key) {
    key.parentElement.classList.add('selected_key');
    let audio = new Audio('Sounds/' + key.id + '.mp3');
    audio.play();
    keys_selected.set(key, audio);
    redraw_staff();
    

}
/**
 * applys the required margin to the black_key elements to fit on top of the
 * white keys
 */
function pad_black_keys() {
    const black_keys = document.querySelectorAll('.black_key');
    let count = -1
    black_keys.forEach(function(black_key) {
        if (count == -1) {
            black_key.style.marginLeft = '2.2vw';
            black_key.style.marginRight = '1.56vw';
            count++;
            return;
        }
        if (count % 5 === 0 || count % 5 === 2) {
            black_key.style.marginLeft = '1.56vw';
        } else {
            black_key.style.marginLeft = '0.35vw';
        }if (count % 5 === 1 || count % 5 === 4) {
            black_key.style.marginRight = '1.56vw';
        } else {
            black_key.style.marginRight = '0.35vw';
        }
        count++;
    })
}
/**
 * removes all elements from the class flat
 */
function remove_all_flats() {
    const flats = document.querySelectorAll(".flat");
        flats.forEach(flat => {
            flat.remove();
        })
}
/**
 * draws the lines of the staff onto the canvas
 * @returns null
 */
function draw_staff() {
    const canvas = document.getElementById('staff_canvas');
    

    const ctx = canvas.getContext('2d');
    const staff_height = 400;
    const skip_lines = [1, 2, 8, 14, 15, 16];
    let height = 0;
    for (let i=1; i <= 16; i++) {
        height += staff_height / 10;
        if (skip_lines.includes(i)) { //middle C
            continue;
        }
        ctx.beginPath();
        ctx.moveTo(40, height);
        ctx.lineTo(160, height);
        ctx.stroke();
        ctx.closePath();
    }
}

/**
 * returns true if the note is above, below or inbetween the staff, such that
 * it requires a ledger line
 * @param {*} true_height : number representing which space the note is in on
 *                          the staff, where 2 is the highest note and 32 is
 *                          the lowest
 * @returns true if it is outside the staff, false otherwise
 */
function is_outside_staff(true_height) {
    return (true_height > 26 || true_height < 5 || true_height === 16);
}

/**
 * Determines whether a note should be drawn off to the side (for second intervals)
 * @param {*} note : string representation of a note e.g. Bb4
 * @returns true if the note should be drawn as a second else false
 */
function is_second(note) {
    let true_note = note[0]; // get the note from A-G
    let note_octave = note[note.length -1];
    let index = true_notes.indexOf(true_note);
    if (index === -1) {
        return;
    }
    let note_below = true_notes[(index - 1 + 7) % 7];
    for (let key of keys_selected.keys()) {
        key_note = key.id;
        key_true_note = key_note[0];
        key_octave = key_note[key_note.length - 1];
        if (key_true_note != note_below) {
            continue;
        }
        if (true_note === 'C') {
            if (note_below === 'B' &&
                note_octave == 1 + parseInt(key_octave)) {
                return !is_second(key.id);
            }
        } else {
            if (note_octave === key_octave) {
                return !is_second(key.id);
            }
        }
    }
    return false;
}
/**
 * draws the appropriate ledger lines for the given note on the given line
 * @param {*} line : number representing which space the note is in on the
 *                   staff, where 2 is the highest note and 32 is the lowest
 * @param {*} ctx : the canvas context to draw on
 * @param {*} note :S tring in notes array e.g "Bb2"
 * @param {*} x : the x position in pixels of the note on the canvas
 */
function draw_ledger_lines(line, ctx, note, x) {
    while (is_outside_staff(line) && line > 0 && line < 33) {
        if (ledger_lines.includes(line)) {
            ctx.beginPath();
            if (is_second(note) && line > 27) {
                ctx.moveTo(x-5, 20*line);
            } else {
                ctx.moveTo(x-30, 20*line);
            }
            ctx.lineTo(x+30, 20*line);
            ctx.stroke();
            ctx.closePath();
        }
        if (line < 5) {
            line++;
        } else {
            line--;
        }
    }
}
/**
 * redners a flat symbol next to the given note
 * @param {*} y : the y position of the note inside the canvas
 * @param {*} note : String in notes array e.g "Bb2"
 * @returns : Null
 */
function draw_flat(y, note) {
    if (document.getElementById(note + '_flat') != null) {
        return;
    }
    const flat = document.createElement('img');
    flat.src = 'Images/flat.png';
    flat.classList.add('flat');
    flat.id =  note + '_flat';
    document.getElementById("staff").appendChild(flat);
    flat.style.right = '10vw';
    flat.style.top = (y /2 - 23) + 'px';
}

/**
 * renders a note at the given height onto the staff with the appropriate
 * ledger lines.
 * @param {*} x : the x position where the note will be rendered
 * @param {*} y : the y position where the note will be rendered
 * @param {*} note : String in notes array e.g "Bb2"
 */
function render_note(x, y, note) {
    const canvas = document.getElementById('staff_canvas');
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.ellipse(x, y, 15, 10, (Math.PI) /2 - 0.2, 0, Math.PI*2, true);
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over';
    if (note.includes('b')) {
        draw_flat(y, note);
    }
    let true_height = y/20;
    if (is_outside_staff(true_height)) {
        draw_ledger_lines(true_height, ctx, note, x);
    }
}

/**
 * draws the provided note onto the canvas.
 * @param {*} note : String in notes array e.g "Bb2"
 */
function draw_note(note) {
    
    let y = 20 * 32; //start from the bottom and go up
    let x;
    for (let value of notes) {
        if (value.includes('b') || value.includes('C')
            || value.includes('F'))  {
            y -= 20;
        }
        if (value === note) {
            x = is_second(note) ? 135 : 100;
            render_note(x, y, note);
            break;
        }
    } 
}
/**
 * clears the canvas and draws the staff + every note that is currently selected
 */
function redraw_staff() {
    const canvas = document.getElementById('staff_canvas');
    canvas.height = CANVAS_HEIGHT;
    canvas.width = CANVAS_WIDTH;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    for (let key of keys_selected.keys()) {
        draw_note(key.id);
    }
    draw_staff();
}

    

        
