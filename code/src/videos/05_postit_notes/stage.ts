import {TOTAL, shotAt, W, type V3} from '../../engine/core/clock';
import {autoGaze} from '../../engine/core/staging';
import {PersonP, seq} from '../../engine/chars/rig';
import type {CarP, MeterP, Things} from '../../engine/kits/downtown/street';
import type {CartP} from '../../engine/kits/grocery/store';
export {TOTAL, shotAt};

export type Stage = {people: PersonP[]; carts: CartP[]; extra: string[]; cars: CarP[]; meters: MeterP[]; things: Things; clock: number; nStoryCars: number};

export function stage(f: number): Stage {
  const s = shotAt(f), lf = s.lf, P: PersonP[] = [], K: CarP[] = [], Mt: MeterP[] = [];
  K.push({p: [6.75, 0, 9.45], ry: Math.PI, col: '#2f4f6a'}, {p: [-6.75, 0, 9.45], ry: Math.PI, col: '#a8443a'});

  switch (s.name) {
    case 'lab':
      P.push({
        who: 'man',
        p: [-0.3, 0, 7.4],
        ...seq(lf, [[0, 'think', 'worried'], [45, 'idle', 'sad'], [90, 'think', 'worried']]),
        gaze: 'cam'
      });
      break;

    case 'mockery':
      P.push({
        who: 'man',
        p: [-0.6, 0, 7.4],
        act: 'think',
        expr: 'worried'
      });
      P.push({
        who: 'goldman',
        p: [0.7, 0, 7.6],
        ...seq(lf, [[0, 'present', 'smirk'], [35, 'wave', 'grin']])
      });
      break;

    case 'choir':
      P.push({
        who: 'youngman',
        p: [0.0, 0, 7.4],
        ...seq(lf, [[0, 'idle', 'worried'], [60, 'present', 'sad']]),
        gaze: 'cam'
      });
      break;

    case 'eureka':
      P.push({
        who: 'youngman',
        p: [0.0, 0, 7.4],
        ...seq(lf, [[0, 'think', 'neutral'], [45, 'eureka', 'happy'], [120, 'proud', 'grin']]),
        gaze: 'cam'
      });
      break;

    case 'success':
      P.push({
        who: 'man',
        p: [-0.5, 0, 7.4],
        ...seq(lf, [[0, 'cheer', 'grin']]),
        gaze: 'cam'
      });
      P.push({
        who: 'youngman',
        p: [0.6, 0, 7.6],
        ...seq(lf, [[0, 'wave', 'happy']]),
        gaze: 'cam'
      });
      break;
  }

  autoGaze(P, Mt);
  return {people: P, carts: [], extra: [], cars: K, meters: Mt, things: {}, clock: 10 + f / 30 / 120, nStoryCars: K.length};
}
