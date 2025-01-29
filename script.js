let keys_selected = new Map()
let mousedown = false
let keydown = false
const key_binds = {'1': 'Gb2', 'q' : 'G2', '2': 'Ab2', 'w' : 'A2', '3': 'Bb2', 'e': 'B2', 'r' : 'C3', '5': 'Db3', 't': 'D3', '6': 'Eb3', 'y': 'E3', 'u': 'F3', '8': 'Gb3', 'i': 'G3', '9': 'Ab3', 'o': 'A3', 'p': 'B3', '0': 'Bb3', '[': 'C4', '=': 'Db4', 'z': 'D4', 's': 'Eb4', 'x': 'E4', 'c': 'F4', 'f': 'Gb4', 'v': 'G4', 'g': 'Ab4', 'b': 'A4', 'h': 'Bb4', 'n': 'B4', 'm': 'C5', 'k': 'Db5', ',': 'D5', 'l': 'Eb5', '.': 'E5', '/': 'F5', '\'': 'Gb5'}
pad_black_keys()

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
    if (event.key in key_binds) {
        key = document.getElementById(key_binds[event.key]);
        if (keys_selected.has(key)) {
            return;
        }
        press_key(key);
    }
}
function keyup_listener(event) {
    if (event.key in key_binds)  {
        key = document.getElementById(key_binds[event.key]);
        key.parentElement.classList.remove('selected_key');
        //keys_selected.get(key).pause();
        keys_selected.delete(key);
    }
}

function press_key(key) {
    key.parentElement.classList.add('selected_key');
    let audio = new Audio('Sounds/' + key.id + '.mp3');
    audio.play();
    keys_selected.set(key, audio);
    

}
function pad_black_keys() {
    const black_keys = document.querySelectorAll('.black_key');
    let count = -1
    black_keys.forEach(function(black_key) {
        if (count == -1) {
            black_key.style.paddingLeft = '2.2vw';
            black_key.style.paddingRight = '1.56vw';
            count++;
            return;
        }
        if (count % 5 === 0 || count % 5 === 2) {
            black_key.style.paddingLeft = '1.56vw';
        } else {
            black_key.style.paddingLeft = '0.35vw';
        }if (count % 5 === 1 || count % 5 === 4) {
            black_key.style.paddingRight = '1.56vw';
        } else {
            black_key.style.paddingRight = '0.35vw';
        }
        count++;
    })
}
        
