import {townSolids} from '../../engine/kits/downtown/townData';
type Box = [number, number, number, number, number, number, string];
const LAB_BENCH: Box = [-0.92, 0.92, 0, 0.95, 5.75, 6.65, 'lab bench'];
export const SOLIDS: Box[] = [...townSolids(), LAB_BENCH];
export const LOGIC_SOLIDS: Box[] = [...townSolids().filter((b) => b[2] < 1.0 && !b[6].startsWith('far car')), LAB_BENCH];
export const GATE_WAIVERS: {key: string; kind: string; why: string}[] = [];
