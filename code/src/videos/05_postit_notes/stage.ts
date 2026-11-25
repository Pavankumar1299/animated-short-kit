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
      // Location 1: Outside FIVE & DIME (-22.5, 7.35)
      const x = lerp(-23.6, -22.5, cl(lf / 42));
      P.push({
        who: 'magee',
        p: [x, 0, 7.35],
        ...seq(lf, [[0, 'walk', 'neutral'], [42, 'think', 'worried'], [100, 'shrug', 'sad']]),
        gaze: 'cam'
      });
      P.push({who: 'paperboy', p: [-30 + ((f * 0.045) % 16), 0, 19.3], act: 'walk', bg: true});
      break;
    }

    case 'mockery': {
      // Location 2: Outside FIRST NATIONAL BANK (22.4, 7.4) - fitting for banker boss
      const bx = lerp(24.0, 23.0, cl(lf / 36));
      P.push({
        who: 'magee',
        p: [21.8, 0, 7.35],
        ...seq(lf, [[0, 'slump', 'sad'], [50, 'think', 'worried']])
      });
      P.push({
        who: 'banker',
        p: [bx, 0, 7.45],
        ...seq(lf, [[0, 'walk', 'smirk'], [36, 'present', 'smug'], [80, 'wave', 'grin']])
      });
      P.push({who: 'nurse', p: [28 - ((f * 0.035) % 16), 0, 20.3], act: 'walk', bg: true});
      break;
    }

    case 'choir': {
      // Location 3: Across the street at MEN'S WEAR (-26.5, 19.5) facing -z
      const px = lerp(-27.5, -26.75, cl(lf / 55));
      P.push({
        who: 'preacher',
        p: [px, 0, 19.5],
        ...seq(lf, [[0, 'tiredWalk', 'worried'], [55, 'shrug', 'sad'], [115, 'present', 'worried']]),
        gaze: 'cam'
      });
      P.push({
        who: 'youngwoman',
        p: [-25.75, 0, 19.4],
        ...seq(lf, [[0, 'idle', 'worried'], [70, 'talk', 'sad']])
      });
      break;
    }

    case 'eureka': {
      // Location 3b: MEN'S WEAR choir podium (-26.5, 19.5) - Art Fry sticks yellow note!
      const px = lerp(-27.1, -26.6, cl(lf / 35));
      P.push({
        who: 'preacher',
        p: [px, 0, 19.5],
        ...seq(lf, [[0, 'walk', 'neutral'], [35, 'eureka', 'happy'], [105, 'proud', 'grin']]),
        gaze: 'cam'
      });
      P.push({
        who: 'youngwoman',
        p: [-25.7, 0, 19.4],
        ...seq(lf, [[0, 'idle', 'surprised'], [45, 'cheer', 'happy']])
      });
      break;
    }

    case 'success': {
      // Location 4: Across the street at INSURANCE plaza (30.0, 19.5) with swirling Post-it storm!
      const mx = lerp(29.0, 29.45, cl(lf / 30));
      const px = lerp(31.0, 30.55, cl(lf / 30));
      P.push({
        who: 'magee',
        p: [mx, 0, 19.5],
        ...seq(lf, [[0, 'walk', 'happy'], [30, 'cheer', 'grin']]),
        gaze: 'cam'
      });
      P.push({
        who: 'preacher',
        p: [px, 0, 19.4],
        ...seq(lf, [[0, 'walk', 'happy'], [30, 'wave', 'grin']]),
        gaze: 'cam'
      });
      break;
    }
  }

  autoGaze(P, Mt);
  return {people: P, carts: [], extra: [], cars: K, meters: Mt, things: {}, clock: 10 + f / 30 / 120, nStoryCars: K.length};
}
