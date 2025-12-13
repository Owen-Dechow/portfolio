// @ts-check

import { Round, rounds } from "./words.js";

/**
 * Seeded PRNG (Mulberry32)
 * @param {number} seed
 */
function mulberry32(seed) {
    return function () {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

/**
 * Fisher–Yates shuffle using seeded PRNG
 * @param {Round[]} array
 * @param {number} seed
 */
function seededShuffle(array, seed) {
    const rng = mulberry32(seed);
    const arr = array.slice(); // copy to avoid mutating original
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const startDate = Date.UTC(2025, 11, 9);
const daysPast = Math.floor((Date.now() - startDate) / 86400000);
const idx = daysPast % rounds.length;

export const targetWord = seededShuffle(rounds, 34756834675)[idx] 
