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
  K.push({p: [6.75, 0, 9.45], ry: Math.PI, col: '#2f4f6a'}, {p: [-6.75, 0, 9.45], ry: Math.PI, col: '#a8443a'});

  switch (s.name) {
    case 'lab': {
      // INSIDE Chemistry Lab (x=-120, z=-1.5): Spencer Silver walks up beside the lab table
      const x = lerp(-121.5, -120.2, cl(lf / 42));
      P.push({
        who: 'magee',
        p: [x, 0, -1.5],
        ...seq(lf, [[0, 'walk', 'neutral'], [42, 'think', 'worried'], [100, 'shrug', 'sad']]),
        sweat: lf >= 70,
        gaze: [-120.0, 1.0, -3.0]
      });
      break;
    }

    case 'mockery': {
      // INSIDE Chemistry Lab (x=-120, z=-1.5): banker walks in, mocks magee
      const bx = lerp(-118.0, -119.2, cl(lf / 36));
      P.push({
        who: 'magee',
        p: [-120.7, 0, -1.5],
        ...seq(lf, [[0, 'slump', 'sad'], [50, 'think', 'worried']]),
        sweat: true
      });
      P.push({
        who: 'banker',
        p: [bx, 0, -1.4],
        ...seq(lf, [[0, 'walk', 'smirk'], [36, 'point', 'smug'], [85, 'wave', 'grin']]),
        talk: lf >= 45
      });
      break;
    }

    case 'choir': {
      // INSIDE Church Sanctuary (x=120, z=-1.4): Art Fry (youngman) paces with sweat beside hymnbook; choir reacts
      const px = lerp(118.5, 119.3, cl(lf / 55));
      P.push({
        who: 'youngman',
        p: [px, 0, -1.4],
        ...seq(lf, [[0, 'tiredWalk', 'worried'], [55, 'shrug', 'sad'], [115, 'present', 'worried']]),
        sweat: lf >= 40,
        gaze: [120.0, 1.1, -2.6]
      });
      P.push({
        who: 'youngwoman',
        p: [120.6, 0, -1.4],
        ...seq(lf, [[0, 'idle', 'worried'], [70, 'talk', 'sad']]),
        talk: lf >= 70
      });
      P.push({
        who: 'grandma',
        p: [121.6, 0, -1.4],
        ...seq(lf, [[0, 'idle', 'neutral'], [80, 'talk', 'worried']])
      });
      break;
    }

    case 'eureka': {
      // INSIDE Church Sanctuary (x=120, z=-1.4): youngman sticks yellow note, jumps in eureka!
      const px = lerp(119.0, 119.6, cl(lf / 32));
      P.push({
        who: 'youngman',
        p: [px, 0, -1.4],
        ...seq(lf, [[0, 'walk', 'neutral'], [32, 'eureka', 'happy'], [105, 'proud', 'grin']]),
        gaze: [120.0, 1.1, -2.6]
      });
      P.push({
        who: 'youngwoman',
        p: [120.8, 0, -1.4],
        ...seq(lf, [[0, 'idle', 'surprised'], [42, 'cheer', 'happy']])
      });
      break;
    }

    case 'success': {
      // Outside INSURANCE / Office plaza (30.0, 19.5) with swirling Post-it storm
      const mx = lerp(28.5, 29.0, cl(lf / 30));
      const px = lerp(31.5, 31.0, cl(lf / 30));
      P.push({
        who: 'magee',
        p: [mx, 0, 19.5],
        ...seq(lf, [[0, 'walk', 'happy'], [30, 'cheer', 'grin']])
      });
      P.push({
        who: 'youngman',
        p: [px, 0, 19.4],
        ...seq(lf, [[0, 'walk', 'happy'], [30, 'wave', 'grin']])
      });
      break;
    }
  }

  autoGaze(P, Mt);
  return {people: P, carts: [], extra: [], cars: K, meters: Mt, things: {}, clock: 10 + f / 30 / 120, nStoryCars: K.length};
}
