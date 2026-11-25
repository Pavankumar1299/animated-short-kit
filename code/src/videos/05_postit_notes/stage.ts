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
      // Spencer Silver (magee) walks up to the LabTable at [-21.3, 0, 7.2] and inspects the beaker
      const x = lerp(-23.6, -22.4, cl(lf / 42));
      P.push({
        who: 'magee',
        p: [x, 0, 7.25],
        ...seq(lf, [[0, 'walk', 'neutral'], [42, 'think', 'worried'], [100, 'shrug', 'sad']]),
        gaze: [-21.3, 1.0, 7.2] // Looking at the beaker on the lab table!
      });
      P.push({who: 'paperboy', p: [-30 + ((f * 0.045) % 16), 0, 19.3], act: 'walk', bg: true});
      break;
    }

    case 'mockery': {
      // Outside FIRST NATIONAL BANK (21.5, 7.4): banker walks up to magee and mocks him
      const bx = lerp(23.2, 22.0, cl(lf / 36));
      P.push({
        who: 'magee',
        p: [20.9, 0, 7.35],
        ...seq(lf, [[0, 'slump', 'sad'], [50, 'think', 'worried']])
      });
      P.push({
        who: 'banker',
        p: [bx, 0, 7.45],
        ...seq(lf, [[0, 'walk', 'smirk'], [36, 'point', 'smug'], [85, 'wave', 'grin']])
      });
      P.push({who: 'nurse', p: [28 - ((f * 0.035) % 16), 0, 21.4], act: 'walk', bg: true});
      break;
    }

    case 'choir': {
      // Choir Stage at [-26.5, 0, 20.6]: Art Fry (youngman) paces frustratedly beside podium; youngwoman & grandma sing
      const px = lerp(-27.8, -26.8, cl(lf / 55));
      P.push({
        who: 'youngman',
        p: [px, 0, 19.5],
        ...seq(lf, [[0, 'tiredWalk', 'worried'], [55, 'shrug', 'sad'], [115, 'present', 'worried']]),
        gaze: [-26.5, 1.1, 20.6]
      });
      P.push({
        who: 'youngwoman',
        p: [-25.5, 0, 19.6],
        ...seq(lf, [[0, 'idle', 'worried'], [70, 'talk', 'sad']])
      });
      P.push({
        who: 'grandma',
        p: [-24.7, 0, 20.1],
        ...seq(lf, [[0, 'idle', 'neutral'], [80, 'talk', 'worried']])
      });
      break;
    }

    case 'eureka': {
      // Choir Stage: youngman steps to podium, sticks yellow note, jumps in eureka!
      const px = lerp(-27.2, -26.5, cl(lf / 32));
      P.push({
        who: 'youngman',
        p: [px, 0, 19.45],
        ...seq(lf, [[0, 'walk', 'neutral'], [32, 'eureka', 'happy'], [105, 'proud', 'grin']]),
        gaze: [-26.5, 1.1, 20.6]
      });
      P.push({
        who: 'youngwoman',
        p: [-25.5, 0, 19.6],
        ...seq(lf, [[0, 'idle', 'surprised'], [42, 'cheer', 'happy']])
      });
      break;
    }

    case 'success': {
      // Success Finale at [30, 0, 20.6]: magee & youngman celebrate beside Post-it table
      const mx = lerp(28.5, 29.0, cl(lf / 30));
      const yx = lerp(31.5, 31.0, cl(lf / 30));
      P.push({
        who: 'magee',
        p: [mx, 0, 19.45],
        ...seq(lf, [[0, 'walk', 'happy'], [30, 'cheer', 'grin']])
      });
      P.push({
        who: 'youngman',
        p: [yx, 0, 19.55],
        ...seq(lf, [[0, 'walk', 'happy'], [30, 'wave', 'grin']])
      });
      break;
    }
  }

  autoGaze(P, Mt);
  return {people: P, carts: [], extra: [], cars: K, meters: Mt, things: {}, clock: 10 + f / 30 / 120, nStoryCars: K.length};
}
