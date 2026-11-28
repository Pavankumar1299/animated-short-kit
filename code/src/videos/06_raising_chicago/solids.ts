import {townSolids} from '../../engine/kits/downtown/townData';
type Box = [number, number, number, number, number, number, string];
const CHICAGO_SOLIDS: Box[] = [
  [-126.0, -113.0, 0, 6.5, -7.2, -3.2, 'chicago houses'],
  [115.8, 116.2, 0, 4.0, -6.0, 4.0, 'dining wall L'],
  [123.8, 124.2, 0, 4.0, -6.0, 4.0, 'dining wall R'],
  [116.0, 124.0, 0, 4.0, -6.2, -5.8, 'dining wall back'],
  [119.3, 120.7, 0, 0.9, -2.4, -1.6, 'dining table']
];
export const SOLIDS: Box[] = [...townSolids(), ...CHICAGO_SOLIDS];
export const LOGIC_SOLIDS: Box[] = [...townSolids().filter((b) => b[2] < 1.0 && !b[6].startsWith('far car')), ...CHICAGO_SOLIDS];
export const GATE_WAIVERS: {key: string; kind: string; why: string}[] = [];
