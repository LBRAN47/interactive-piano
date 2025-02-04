
import {notes} from './script.js';

const maj = [4, 3, 5];
const min = [3, 4, 5];
const half_dim = [3, 3, 6];
const sus = [5, 2, 5];
const sus2 = [2, 5, 5];
const aug = [4, 4, 4];
const flat5 = [4, 2, 6];
const maj7 = [4, 3, 4, 1];
const seventh = [4, 3, 3, 2];
const min7 = [3, 4, 3, 2];
const minmaj7 = [3, 4, 4, 1];
const dim = [3, 3, 3, 3];
const dim7 = [3, 3, 4, 2];
const maj6 = [4, 3, 2, 3];
const min6 = [3, 4, 2, 3];
const triads = [maj, min, half_dim, sus, sus2, aug, flat5];
const quads = [maj7, min7, seventh, dim, dim7, minmaj7];
//these chords are given priority as they are technically inversions
//of other chords, but are better known with these names
const prio_chords = [sus2, sus, maj6, min6];  

const chord_names = new Map([[maj, ""], [min, 'm'], [half_dim, 'ø'],
    [sus, 'sus'], [sus2, 'sus2'], [aug, 'aug'], [flat5, '♭5'],
    [maj7, 'maj7'], [min7, 'm7'], [seventh, '7'], [dim, 'dim'],
    [dim7, 'm7(♭5)'], [maj6, '6'], [min6, 'min6'], [minmaj7, 'm(maj7)']]);
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
            lowest_note_pos = notes.indexOf(key.id);
            continue;
        }
        let key_pos = notes.indexOf(key.id);
        if (key_pos < lowest_note_pos) {
            lowest_note = key;
            lowest_note_pos = notes.indexOf(key.id);
        }
    }
    return lowest_note;
}
function get_octave(note) {
    return parseInt(note[note.length-1]);
}
function lower_octave(note) {
    let octave = get_octave(note) - 1;
    return note.replace(get_octave(note).toString(), octave.toString());
}

function sort_by_pitch(arr) {
    let swapped, temp;  
    for (let i = 0; i < arr.length - 1; i++) {
        swapped = false;
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (notes.indexOf(arr[j]) > notes.indexOf(arr[j+1])) {
                temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
                swapped = true;
            }
        }
        if (swapped === false) {
            break;
        }
    }
    return arr;
}
function remove_octaves(keys_selected) {
    let bass_note = get_bass_note(keys_selected.keys());
    if (bass_note != undefined) {
        bass_note = bass_note.id;
    }
    let chord_notes = [];
    let true_notes = [];
    for (let key of keys_selected.keys()) {
        key = key.id;
        if (!true_notes.includes(get_true_note(key))) {
            while (notes.indexOf(lower_octave(key)) > notes.indexOf(bass_note)) {
                key = lower_octave(key);
            }
            chord_notes.push(key);
            true_notes.push(get_true_note(key));
        } else {
            for (let i = 0; i < chord_notes.length; i++) {
                if (get_true_note(chord_notes[i]) === get_true_note(key) &&
                get_octave(chord_notes[i]) > get_octave(key)) {
                    chord_notes[i] = key;
                }   
            }
        }
    }
    return sort_by_pitch(chord_notes);
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
    console.log(keys_selected)
    let intervals = get_chord_intervals(keys_selected);
    console.log(intervals);
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
    console.log('intervals: ' + intervals)
    let chords;
    if (intervals.length === 3) {
        chords = triads;
    } else if (intervals.length === 4) {
        chords = quads;
    } else {
        return;
    }
    for (let chord of chords) {
        for (let chord_type of  prio_chords) {
            if (array_equals(chord_type, intervals)) {
                return get_chord_string(chord_type, bass_note, bass_note);
            }
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
    return;
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
