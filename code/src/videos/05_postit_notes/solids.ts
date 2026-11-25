import {townSolids} from '../../engine/kits/downtown/townData';
type Box = [number, number, number, number, number, number, string];
// Indoor Lab at x=-120 (walls + table), Indoor Church at x=120 (walls + podium), Success table at [30, 20.6]
const STORY_PROPS: Box[] = [
  [-124.2, -123.8, 0, 4.0, -6.0, 4.0, 'lab wall L'],
  [-116.2, -115.8, 0, 4.0, -6.0, 4.0, 'lab wall R'],
  [-124.0, -116.0, 0, 4.0, -6.2, -5.8, 'lab wall back'],
  [-120.7, -119.3, 0, 0.95, -3.45, -2.55, 'lab table'],
  [115.8, 116.2, 0, 4.2, -6.0, 4.0, 'church wall L'],
  [123.8, 124.2, 0, 4.2, -6.0, 4.0, 'church wall R'],
  [116.0, 124.0, 0, 4.2, -6.2, -5.8, 'church wall back'],
  [119.55, 120.45, 0, 1.25, -2.95, -2.25, 'choir podium'],
  [29.35, 30.65, 0, 1.05, 20.15, 21.05, 'success table']
];
export const SOLIDS: Box[] = [...townSolids(), ...STORY_PROPS];
export const LOGIC_SOLIDS: Box[] = [...townSolids().filter((b) => b[2] < 1.0 && !b[6].startsWith('far car')), ...STORY_PROPS];
export const GATE_WAIVERS: {key: string; kind: string; why: string}[] = [];
