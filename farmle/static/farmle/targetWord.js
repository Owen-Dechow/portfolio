// @ts-check

import { rounds } from "./words.js";

const startDate = new Date(2025, 11, 15);
const currentDate = new Date()
const millisecondsInDay = 1000 * 60 * 60 * 24;
const daysPast = Math.floor((currentDate.getTime() - startDate.getTime()) / millisecondsInDay);
const idx = daysPast % rounds.length;

export const targetWord = rounds[idx] 
