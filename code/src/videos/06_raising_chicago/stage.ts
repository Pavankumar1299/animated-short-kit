import {TOTAL, shotAt, cl, ease} from '../../engine/core/clock';
import {autoGaze} from '../../engine/core/staging';
import {PersonP, seq} from '../../engine/chars/rig';
import type {CarP, MeterP, Things} from '../../engine/kits/downtown/street';
import type {CartP} from '../../engine/kits/grocery/store';
export {TOTAL, shotAt};

export type Stage = {people: PersonP[]; carts: CartP[]; extra: string[]; cars: CarP[]; meters: MeterP[]; things: Things; clock: number; nStoryCars: number};
const lerp = (a: number, b: number, t: number) => a + (b - a) * ease(t);

export function stage(f: number): Stage {
  const s = shotAt(f), lf = s.lf, P: PersonP[] = [], K: CarP[] = [], Mt: MeterP[] = [];

  switch (s.name) {
    case 'mud': {
      const mx = lerp(-121.6, -120.6, cl(lf / 45));
      P.push({
        who: 'magee',
        p: [mx, 0, 0.2],
        ...seq(lf, [[0, 'tiredWalk', 'worried'], [45, 'shrug', 'sad']]),
        sweat: true,
        gaze: 'cam'
      });
      P.push({
        who: 'man',
        p: [-119.0, 0, 0.4],
        ...seq(lf, [[0, 'slump', 'sad'], [60, 'talk', 'worried']])
      });
      break;
    }

    case 'mockery': {
      const bx = lerp(-117.8, -119.1, cl(lf / 35));
      P.push({
        who: 'magee',
        p: [-120.6, 0, 0.2],
        ...seq(lf, [[0, 'present', 'neutral'], [55, 'think', 'worried']]),
        sweat: lf >= 65
      });
      P.push({
        who: 'banker',
        p: [bx, 0, 0.3],
        ...seq(lf, [[0, 'walk', 'smirk'], [35, 'point', 'grin']]),
        talk: lf >= 45
      });
      break;
    }

    case 'jacks': {
      P.push({
        who: 'mechanic',
        p: [-121.2, 0, 0.1],
        ...seq(lf, [[0, 'push', 'proud'], [80, 'cheer', 'grin']])
      });
      P.push({
        who: 'man',
        p: [-118.8, 0, 0.1],
        ...seq(lf, [[0, 'pull', 'happy'], [80, 'wave', 'grin']])
      });
      P.push({
        who: 'magee',
        p: [-120.0, 0, 0.5],
        ...seq(lf, [[0, 'present', 'proud'], [70, 'cheer', 'happy']]),
        gaze: 'cam'
      });
      break;
    }

    case 'dinner': {
      P.push({
        who: 'grandma',
        p: [119.0, 0, -1.2],
        ...seq(lf, [[0, 'talk', 'happy'], [70, 'idle', 'grin']]),
        talk: lf < 70,
        gaze: [120.0, 0.9, -2.0]
      });
      P.push({
        who: 'kid',
        p: [121.0, 0, -1.2],
        ...seq(lf, [[0, 'cheer', 'happy'], [60, 'bounce', 'grin']]),
        gaze: [120.0, 0.9, -2.0]
      });
      break;
    }

    case 'city': {
      P.push({
        who: 'magee',
        p: [-120.4, 0, 0.2],
        ...seq(lf, [[0, 'proud', 'grin'], [40, 'cheer', 'grin']]),
        gaze: 'cam'
      });
      P.push({
        who: 'banker',
        p: [-119.0, 0, 0.3],
        ...seq(lf, [[0, 'idle', 'surprised'], [35, 'shrug', 'shock']])
      });
      break;
    }
  }

  autoGaze(P, Mt);
  return {people: P, carts: [], extra: [], cars: K, meters: Mt, things: {}, clock: 10 + f / 30 / 120, nStoryCars: 0};
}
