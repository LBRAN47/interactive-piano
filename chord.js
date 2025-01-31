
import {notes} from './script.js';


export function get_bass_note(keys_selected) {
    let lowest_note, lowest_note_pos;
    for (let key of keys_selected.keys()) {
        key = key.id
        if (lowest_note === undefined) {
            lowest_note = key;
            lowest_note_pos = notes.indexOf(key);
        }
        let key_pos = notes.indexOf(key);
        if (key_pos < lowest_note_pos) {
            lowest_note = key;
            lowest_note_pos = notes.indexOf(key);
        }
    }
    return lowest_note;
}

export function draw_bass_note(keys_selected) {
    let bass_note = get_bass_note(keys_selected);
    if (bass_note === undefined) {
        document.getElementById("staff_chord").innerHTML = '';
        return;
    }
    if (bass_note.includes('b')) {
        bass_note = bass_note.slice(0, 2);
    } else {
        bass_note = bass_note.slice(0, 1);
    }
    document.getElementById("staff_chord").innerHTML = bass_note;
}
