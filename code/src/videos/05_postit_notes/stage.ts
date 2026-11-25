import { TOTAL, shotAt, cl, ease, type V3 } from '../../engine/core/clock';
import { autoGaze } from '../../engine/core/staging';
import { PersonP, seq } from '../../engine/chars/rig';
import type { CarP, MeterP, Things } from '../../engine/kits/downtown/street';
import type { CartP } from '../../engine/kits/grocery/store';
export { TOTAL, shotAt };

export type Stage = { people: PersonP[]; carts: CartP[]; extra: string[]; cars: CarP[]; meters: MeterP[]; things: Things; clock: number; nStoryCars: number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * ease(t);

export function stage(f: number): Stage {
  const s = shotAt(f), lf = s.lf, P: PersonP[] = [], K: CarP[] = [], Mt: MeterP[] = [];
  K.push({ p: [6.75, 0, 9.45], ry: Math.PI, col: '#2f4f6a' }, { p: [-6.75, 0, 9.45], ry: Math.PI, col: '#a8443a' });

  // Walking background pedestrians on separate far-sidewalk lanes (clear of bins at z=18.75)
  P.push(
    { who: 'paperboy', p: [-12 + ((f * 0.045) % 24), 0, 19.3], act: 'walk', bg: true },
    { who: 'nurse', p: [10 - ((f * 0.035) % 22), 0, 20.2], act: 'walk', bg: true },
    { who: 'baker', p: [-4 + ((f * 0.025) % 18), 0, 21.1], act: 'walk', bg: true }
  );

  switch (s.name) {
    case 'lab': {
      // Spencer Silver (magee) walks in toward the lab bench, inspects weak glue, shrugs
      const x = lerp(-1.1, -0.15, cl(lf / 42));
      P.push({
        who: 'magee',
        p: [x, 0, 7.45],
        ...seq(lf, [[0, 'walk', 'neutral'], [42, 'think', 'worried'], [100, 'shrug', 'sad']]),
        gaze: 'cam'
      });
      break;
    }

    case 'mockery': {
      // Skeptical 3M boss (banker) struts in and mocks Spencer Silver (magee)
      const bx = lerp(1.5, 0.65, cl(lf / 36));
      P.push({
        who: 'magee',
        p: [-0.6, 0, 7.45],
        ...seq(lf, [[0, 'slump', 'sad'], [50, 'think', 'worried']])
      });
      P.push({
        who: 'banker',
        p: [bx, 0, 7.55],
        ...seq(lf, [[0, 'walk', 'smirk'], [36, 'present', 'smug'], [80, 'wave', 'grin']])
      });
      break;
    }

    case 'choir': {
      // Art Fry (preacher) paces frustratedly as bookmarks slip; choir partner (youngwoman) watches
      const px = lerp(-0.9, -0.15, cl(lf / 55));
      P.push({
        who: 'preacher',
        p: [px, 0, 7.45],
        ...seq(lf, [[0, 'tiredWalk', 'worried'], [55, 'shrug', 'sad'], [115, 'present', 'worried']]),
        gaze: 'cam'
      });
      P.push({
        who: 'youngwoman',
        p: [0.8, 0, 7.55],
        ...seq(lf, [[0, 'idle', 'worried'], [70, 'talk', 'sad']])
      });
      break;
    }

    case 'eureka': {
      // Art Fry steps up to the hymnbook, sticks the yellow note, and hits Eureka!
      const px = lerp(-0.55, 0.0, cl(lf / 35));
      P.push({
        who: 'preacher',
        p: [px, 0, 7.45],
        ...seq(lf, [[0, 'walk', 'neutral'], [35, 'eureka', 'happy'], [105, 'proud', 'grin']]),
        gaze: 'cam'
      });
      P.push({
        who: 'youngwoman',
        p: [0.85, 0, 7.55],
        ...seq(lf, [[0, 'idle', 'surprised'], [45, 'cheer', 'happy']])
      });
      break;
    }

    case 'success': {
      // Both inventors step together and celebrate amid the storm of yellow Post-it notes
      const mx = lerp(-0.9, -0.5, cl(lf / 30));
      const px = lerp(0.95, 0.55, cl(lf / 30));
      P.push({
        who: 'magee',
        p: [mx, 0, 7.45],
        ...seq(lf, [[0, 'walk', 'happy'], [30, 'cheer', 'grin']]),
        gaze: 'cam'
      });
      P.push({
        who: 'preacher',
        p: [px, 0, 7.55],
        ...seq(lf, [[0, 'walk', 'happy'], [30, 'wave', 'grin']]),
        gaze: 'cam'
      });
      break;
    }
  }

  autoGaze(P, Mt);
  return { people: P, carts: [], extra: [], cars: K, meters: Mt, things: {}, clock: 10 + f / 30 / 120, nStoryCars: K.length };
}
