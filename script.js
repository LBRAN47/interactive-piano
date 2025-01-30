let keys_selected = new Map()
let mousedown = false
let keydown = false
const key_binds = new Map([['1', 'Gb2'], ['q' , 'G2'], ['2', 'Ab2'], ['w' , 'A2'],
    ['3', 'Bb2'], ['e', 'B2'], ['r' , 'C3'], ['5', 'Db3'], ['t', 'D3'], ['6', 'Eb3'],
    ['y', 'E3'], ['u', 'F3'], ['8', 'Gb3'], ['i', 'G3'], ['9', 'Ab3'], ['o', 'A3'],
    ['p', 'B3'], ['0', 'Bb3'], ['[', 'C4'], ['=', 'Db4'], ['z', 'D4'], ['s', 'Eb4'],
    ['x', 'E4'], ['c', 'F4'], ['f', 'Gb4'], ['v', 'G4'], ['g', 'Ab4'], ['b', 'A4'],
    ['h', 'Bb4'], ['n', 'B4'], ['m', 'C5'], ['k', 'Db5'], [',', 'D5'], ['l', 'Eb5'],
    ['.', 'E5'], ['/', 'F5'], ['\'', 'Gb5']]);
const notes = ['A1', 'Bb1', 'B1', 'C2', 'Db2', 'D2', 'Eb2', 'E2', 'F2', 'Gb2',
    'G2', 'Ab2', 'A2', 'Bb2', 'B2', 'C3', 'Db3', 'D3', 'Eb3', 'E3', 'F3',
    'Gb3', 'G3', 'Ab3', 'A3', 'Bb3', 'B3', 'C4', 'Db4', 'D4', 'Eb4', 'E4',
    'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5', 'Db5', 'D5', 'Eb5',
    'E5', 'F5', 'Gb5', 'G5', 'Ab5', 'A5', 'Bb5', 'B5', 'C6'];
pad_black_keys();
draw_staff();

window.addEventListener('mouseup', (event) => {
        let keys = [];
        keys_selected.forEach((audio, key_selected) => {
            key_selected.parentElement.classList.remove('selected_key');
            //audio.pause();
            keys.push(key_selected);
        })
        keys_selected.clear();
        mousedown = false;
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
        //keys_selected.get(key).pause();
        keys_selected.delete(key);
    }
}

function press_key(key) {
    key.parentElement.classList.add('selected_key');
    let audio = new Audio('Sounds/' + key.id + '.mp3');
    audio.play();
    draw_note(key.id);
    keys_selected.set(key, audio);
    

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
    canvas.height = 800;
    canvas.width = 200;

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
function draw_note(note) {
    const canvas = document.getElementById('staff_canvas');
    const ctx = canvas.getContext('2d');
    let height = 20 * 32; //start from the bottom and go up
    const ledger_lines = [2, 4, 16, 28, 30, 32]
    for (let value of notes) {
        if (value.includes('b') || value.includes('C') || value.includes('F'))  {
            height -= 20;
        }
        if (value === note) {
            ctx.beginPath();
            ctx.arc(100, height, 16, 0, Math.PI * 2, true);
            ctx.fill();
            let true_height = height/20;
            if (is_outside_staff(true_height)) {
                let line = true_height;
                while (is_outside_staff(line) && line > 0 && line < 33) {
                    if (ledger_lines.includes(line)) {
                        ctx.beginPath();
                        ctx.moveTo(70, 20*line);
                        ctx.lineTo(130, 20*line);
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
            break;
        }
    } 
}

    

        
