import {townSolids} from '../../engine/kits/downtown/townData';
type Box = [number, number, number, number, number, number, string];
// Lab table at [-21.3, 7.2], Choir podium at [-26.5, 20.6], Success table at [30.0, 20.6]
const STORY_PROPS: Box[] = [
  [-21.95, -20.65, 0, 0.95, 6.75, 7.65, 'lab table'],
  [-26.95, -26.05, 0, 1.25, 20.25, 20.95, 'choir podium'],
  [29.35, 30.65, 0, 1.05, 20.15, 21.05, 'success table']
];
export const SOLIDS: Box[] = [...townSolids(), ...STORY_PROPS];
export const LOGIC_SOLIDS: Box[] = [...townSolids().filter((b) => b[2] < 1.0 && !b[6].startsWith('far car')), ...STORY_PROPS];
export const GATE_WAIVERS: {key: string; kind: string; why: string}[] = [];
