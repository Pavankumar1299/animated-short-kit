// Staging for 03_shopping_cart: characters, positions, gestures, expressions per frame
import { TOTAL, shotAt, W, cl, ease } from '../../engine/core/clock';
import { autoGaze } from '../../engine/core/staging';
import { PersonP, seq } from '../../engine/chars/rig';
import type { CarP, MeterP, Things } from '../../engine/kits/downtown/street';
import type { CartP } from '../../engine/kits/grocery/store';
export { TOTAL, shotAt };

export type Stage = {
  people: PersonP[];
  carts: CartP[];
  extra: string[];
  cars: CarP[];
  meters: MeterP[];
  things: Things;
  clock: number;
  nStoryCars: number;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * ease(t);

export function stage(f: number): Stage {
  const s = shotAt(f), lf = s.lf, P: PersonP[] = [], K: CarP[] = [], Ct: CartP[] = [], Mt: MeterP[] = [], Ex: string[] = [];

  // Street parking context
  K.push(
    { p: [6.75, 0, 9.45], ry: Math.PI, col: '#2f4f6a' },
    { p: [-6.75, 0, 9.45], ry: Math.PI, col: '#a8443a' }
  );

  // Walking background pedestrians on separate far-sidewalk lanes (clear of bins at z=18.75)
  P.push(
    { who: 'paperboy', p: [-10 + ((f * 0.04) % 20), 0, 19.3], act: 'walk', bg: true },
    { who: 'baker', p: [9 - ((f * 0.03) % 18), 0, 20.6], act: 'walk', bg: true }
  );

  switch (s.name) {
    case 'hook': {
      // Goldman steps forward presenting; paid shopper actually walks along sidewalk pushing cart
      const gx = lerp(-1.05, -0.65, cl(lf / 28));
      const sx = lerp(1.55, 0.35, cl(lf / 85));
      const cx = sx - 0.35;
      P.push({
        who: 'goldman',
        p: [gx, 0, 7.4],
        ...seq(lf, [
          [0, 'walk', 'proud'],
          [28, 'present', 'proud'],
          [W('hook', 'push'), 'talk', 'happy']
        ]),
        gaze: 'cam'
      });

      P.push({
        who: 'shopper',
        p: [sx, 0, 7.4],
        ...seq(lf, [
          [0, 'walk', 'happy'],
          [85, 'idle', 'grin']
        ]),
        hold: { p: [cx, 0, 7.4], ry: 0, id: 0, k: 0.9 },
        gaze: 'cam'
      });

      Ct.push({
        p: [cx, 0, 7.4],
        ry: 0,
        fill: 0
      });
      break;
    }

    case 'refusal': {
      // Real customers (shopper2 & grandma) recoil and scoff at the parked cart
      const sx2 = lerp(-0.35, -0.75, cl(lf / 36));
      const gx = lerp(1.05, 0.72, cl(lf / 36));
      P.push({
        who: 'shopper2',
        p: [sx2, 0, 7.4],
        ...seq(lf, [
          [0, 'walk', 'smirk'],
          [36, 'cross', 'smirk'],
          [W('refusal', 'ridiculous'), 'point', 'smirk']
        ]),
        gaze: [gx, 1.4, 7.4]
      });

      P.push({
        who: 'grandma',
        p: [gx, 0, 7.4],
        ...seq(lf, [
          [0, 'walk', 'smug'],
          [36, 'talk', 'smug'],
          [W('refusal', 'baby'), 'shrug', 'smug']
        ]),
        gaze: [sx2, 1.4, 7.4]
      });

      // Parked empty cart they refuse to touch
      Ct.push({
        p: [-1.75, 0, 7.4],
        ry: 0.2,
        fill: 0
      });
      break;
    }

    case 'revolution': {
      // Trick worked: Goldman cheering; youngwoman happily pushing full cart; coins bursting
      const yx = lerp(1.45, 0.35, cl(lf / 75));
      const cx = yx - 0.35;
      P.push({
        who: 'goldman',
        p: [-0.75, 0, 7.4],
        ...seq(lf, [
          [0, 'cheer', 'grin'],
          [W('revolution', 'billion'), 'proud', 'grin']
        ]),
        gaze: 'cam'
      });

      P.push({
        who: 'youngwoman',
        p: [yx, 0, 7.4],
        ...seq(lf, [
          [0, 'walk', 'happy'],
          [75, 'cheer', 'grin']
        ]),
        hold: { p: [cx, 0, 7.4], ry: 0, id: 0, k: 0.9 },
        gaze: 'cam'
      });

      // Loaded grocery cart
      Ct.push({
        p: [cx, 0, 7.4],
        ry: 0,
        fill: 1
      });

      Ex.push('coins', 'bulb');
      break;
    }
  }

  autoGaze(P, Mt);
  return {
    people: P,
    carts: Ct,
    extra: Ex,
    cars: K,
    meters: Mt,
    things: {},
    clock: 10 + f / 30 / 60,
    nStoryCars: K.length
  };
}
