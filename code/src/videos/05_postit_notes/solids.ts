import {townSolids} from '../../engine/kits/downtown/townData';
type Box = [number, number, number, number, number, number, string];
// Lab bench at FIVE & DIME (-22.5, 6.1), Choir podium at MEN'S WEAR (-26.5, 20.9), Success pedestal at INSURANCE (30, 20.9)
const STORY_PROPS: Box[] = [
  [-23.42, -21.58, 0, 0.95, 5.65, 6.55, 'lab bench'],
  [-26.95, -26.05, 0, 1.25, 20.55, 21.25, 'choir podium'],
  [29.4, 30.6, 0, 1.15, 20.5, 21.3, 'success pedestal']
];
export const SOLIDS: Box[] = [...townSolids(), ...STORY_PROPS];
export const LOGIC_SOLIDS: Box[] = [...townSolids().filter((b) => b[2] < 1.0 && !b[6].startsWith('far car')), ...STORY_PROPS];
export const GATE_WAIVERS: {key: string; kind: string; why: string}[] = [];
