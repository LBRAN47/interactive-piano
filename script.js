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
        redraw_staff();
    }
}

function press_key(key) {
    key.parentElement.classList.add('selected_key');
    let audio = new Audio('Sounds/' + key.id + '.mp3');
    audio.play();
    keys_selected.set(key, audio);
    redraw_staff();
    

}
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
    return;
}
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
 * renders a note at the given height onto the staff with the appropriate
 * ledger lines.
 * @param {*} ctx : a CanvasRenderingContext2D Object to render to
 * @param {*} height : the y height in pixels of the note to be rendered
 */
function render_note(ctx, height, note) {
    let x;
    if (is_second(note)) {
        x = 135;
    } else {
        x = 100;
    }
    ctx.beginPath();
    ctx.arc(x, height, 20, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.ellipse(x, height, 15, 10, (Math.PI) /2 - 0.2, 0, Math.PI*2, true);
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over';
    let true_height = height/20;
    if (is_outside_staff(true_height)) {
        let line = true_height;
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
}

/**
 * creates a CanvasRenderingContext2D object and draws the provided note onto
 * the canvas.
 * @param {*} note : String in notes array e.g "Bb2"
 */
function draw_note(note) {
    const canvas = document.getElementById('staff_canvas');
    const ctx = canvas.getContext('2d');
    let height = 20 * 32; //start from the bottom and go up
    for (let value of notes) {
        if (value.includes('b') || value.includes('C')
            || value.includes('F'))  {
            height -= 20;
        }
        if (value === note) {
            render_note(ctx, height, note);
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

    

        
