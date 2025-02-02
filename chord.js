
import {notes} from './script.js';

/**
 * taking in an iterable of keys, returns the lowest note. If empty returns
 * undefined.
 * @param {*} keys_selected : iterable of key elements
 * @returns : string ID of the lowest note if one exists, else undefined.
 */
export function get_bass_note(keys_selected) {
    let lowest_note, lowest_note_pos;
    for (let key of keys_selected) {
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

/**
 * taking in an iterable of key elements, returns an array of numbers
 * representing the interval between each note in the chord.
 * e.g. keys_selected = [E5, Ab5, B5] => [4, 3]
 *      keys_selected = [B3, Eb4, Gb4, A4] => [4, 3, 3]
 * @param {*} keys_selected : iterable of key elements
 * @returns undefined if keys_selected is empty, else an array of
 *          numbers.
 */
export function get_chord_intervals(keys_selected) {
    const bass_note = get_bass_note(keys_selected);
    if (bass_note === undefined) {
        return undefined;
    }
    let count = 0;
    let intervals = [];
    for (let i = notes.indexOf(bass_note) + 1; i < notes.length; i++) {
        count++;
        for (let key of keys_selected) {
            if (key.id === notes[i]) {
                intervals.push(count);
                count = 0;
            }
        }
    }
    return intervals;
}


export function draw_bass_note(keys_selected) {
    let bass_note = get_bass_note(keys_selected.keys());
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
