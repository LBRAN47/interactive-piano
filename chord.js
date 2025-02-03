
import {notes} from './script.js';

const maj = [4, 3, 5];
const min = [3, 4, 5];
const dim = [3, 3, 6];
const sus = [5, 2, 5];
const sus2 = [2, 5, 5];
const maj7 = [4, 3, 4, 1];
const triads = [maj, min, dim, sus, sus2];

const chord_names = new Map([[maj, ""], [min, 'm'], [dim, 'dim'], [sus, 'sus'], [sus2, 'sus2']]);
/**
 * taking in an iterable of keys, returns the lowest note. If empty returns
 * undefined.
 * @param {*} keys_selected : iterable of key elements
 * @returns : string ID of the lowest note if one exists, else undefined.
 */
export function get_bass_note(keys_selected) {
    let lowest_note, lowest_note_pos;
    for (let key of keys_selected) {
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
function get_octave(note) {
    return parseInt(note[note.length-1]);
}
function remove_octaves(keys_selected) {
    let notes = [];
    let true_notes = [];
    for (let key of keys_selected.keys()) {
        if (!true_notes.includes(get_true_note(key.id))) {
            notes.push(key.id);
            true_notes.push(get_true_note(key.id));
        } else {
            for (let i = 0; i < notes.length; i++) {
                if (get_true_note(notes[i]) === get_true_note(key.id) &&
                get_octave(notes[i]) > get_octave(key.id)) {
                    notes[i] = key.id;
                }
            }
        }
    }
    return notes;
}
/**
 * taking in an iterable of key elements, returns an array of numbers
 * representing the interval between each note in the chord.
 * e.g. keys_selected = [E5, Ab5, B5] => [43, 4, 3]
 *      keys_selected = [B3, Eb4, Gb4, A4] => [26, 4, 3, 3]
 * @param {*} keys_selected : iterable of key elements
 * @returns undefined if keys_selected is empty, else an array of
 *          numbers.
 */
export function get_chord_intervals(keys_selected) {
    keys_selected = remove_octaves(keys_selected);
    const bass_note = get_bass_note(keys_selected);
    if (bass_note === undefined) {
        return undefined;
    }
    let count = 0;
    let intervals = [];
    intervals.push(notes.indexOf(bass_note));
    for (let i = notes.indexOf(bass_note) + 1; i < notes.length; i++) {
        count++;
        for (let key of keys_selected) {
            if (key === notes[i]) {
                intervals.push(count);
                count = 0;
            }
        }
    }
    return intervals;
}
/**
 * converts an intervals array of the form:
 * [bass_index, interval, interval, ... interval]
 * to an array of the form [interval, interval ... interval, total_interval]
 * where total_interval is the sum of all the intervals.
 * This new array forms a generalisation which will be used to deduce the
 * type of chord that is constructed.
 */
function convert_intervals(array) {
    array.splice(0, 1);
    let sum = 0;
    for (let num of array) {
        sum += num;
    }
    array.push(sum);
    return array;
}
/**
 * "shuffles" the interval array to the chosen start index
 * e.g. shuffle_chord([1, 2, 3], 1) => [2, 3, 1]
 *      shuffle_chord([3, 4, 5, 2], 3) => [2, 3, 4, 5]
 * @param {*} intervals : an array of numbers
 * @param {*} start : the chosen starting index
 */
export function shuffle_chord(intervals, start) {
    return intervals.slice(start).concat(intervals.slice(0, start));
}

/**
 * takes in a map of the keys_selected and returns the name
 * of the chord.
 * @param {*} keys_selected 
 * @returns 
 */
export function get_chord(keys_selected) {
    let intervals = get_chord_intervals(keys_selected);
    if (intervals === undefined) {
        return;
    }
    let bass_note = intervals[0];
    intervals = convert_intervals(intervals);
    for (let i = 0; i < intervals.length; i++) {
        while (intervals[i] > 6) {
            intervals[i] = Math.abs(intervals[i]-12);
        }
    }
    let chords;
    if (intervals.length === 3) {
        chords = triads;
    } else {
        return;
    }
    for (let chord of chords) {
        if (array_equals(sus2, intervals)) {
            return get_chord_string(sus2, bass_note, bass_note);
        } else if (array_equals(sus, intervals)) {
            return get_chord_string(sus, bass_note, bass_note);
        }
        let true_bass = bass_note;
        for (let i=0; i < intervals.length; i++) {
            let interval_shuffle = shuffle_chord(intervals, i);
            if (interval_shuffle.toString() === chord.toString()) {
                return get_chord_string(chord, true_bass, bass_note);
            }
            true_bass += intervals[i];
        }
    }
    return "YO";
    

}
function get_chord_string(chord, true_bass, bass_note) {
    if (true_bass === bass_note) {
        return get_true_note(notes[true_bass]) + chord_names.get(chord);
    } else {
        return get_true_note(notes[true_bass]) + chord_names.get(chord) + 
                    "/" + get_true_note(notes[bass_note]);
    }
}

function array_equals(arr1, arr2) {
    return (arr1.toString() === arr2.toString());
}

function get_true_note(note) {
    if (note.includes('b')) {
        note = note.slice(0, 2);
    } else {
        note = note.slice(0, 1);
    }
    return note;
}



export function draw_bass_note(keys_selected) {
    let chord = get_chord(keys_selected);
    if (chord === undefined) {
        document.getElementById("staff_chord").innerHTML = '';
        return;
    }
    document.getElementById("staff_chord").innerHTML = chord;
}
