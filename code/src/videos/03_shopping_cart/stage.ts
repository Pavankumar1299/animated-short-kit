// Staging for 03_shopping_cart: CUSTOMERS INSIDE THE GROCERY STORE (checkered floor, stocked aisles)
import {TOTAL, shotAt, W, cl, ease} from '../../engine/core/clock';
import {autoGaze} from '../../engine/core/staging';
import {PersonP, seq} from '../../engine/chars/rig';
import type {CarP, MeterP, Things} from '../../engine/kits/downtown/street';
import type {CartP} from '../../engine/kits/grocery/store';
export {TOTAL, shotAt};

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

  // Parked cars outside on the street
  K.push(
    {p: [6.75, 0, 9.45], ry: Math.PI, col: '#2f4f6a'},
    {p: [-6.75, 0, 9.45], ry: Math.PI, col: '#a8443a'}
  );

  switch (s.name) {
    case 'hook': {
      // INSIDE STORE (z=-0.8..-0.4): Goldman presenting; paid shopper walks down the aisle pushing cart
      const gx = lerp(-0.95, -0.65, cl(lf / 28));
      const sx = lerp(1.15, 0.3, cl(lf / 85));
      const cx = sx - 0.35;
      P.push({
        who: 'goldman',
        p: [gx, 0, -0.8],
        ...seq(lf, [
          [0, 'walk', 'proud'],
          [28, 'present', 'proud'],
          [W('hook', 'push'), 'talk', 'happy']
        ]),
        talk: lf >= W('hook', 'push'),
        gaze: 'cam'
      });

      P.push({
        who: 'shopper',
        p: [sx, 0, -0.4],
        ...seq(lf, [
          [0, 'walk', 'happy'],
          [85, 'idle', 'grin']
        ]),
        hold: {p: [cx, 0, -0.4], ry: 0, id: 0, k: 0.9},
        gaze: 'cam'
      });

      Ct.push({
        p: [cx, 0, -0.4],
        ry: 0,
        fill: 0
      });
      break;
    }

    case 'refusal': {
      // INSIDE STORE (z=-0.6): real customers (shopper2 & grandma) scoffing at the parked empty cart
      const sx2 = lerp(-0.3, -0.65, cl(lf / 36));
      const gx = lerp(0.95, 0.65, cl(lf / 36));
      P.push({
        who: 'shopper2',
        p: [sx2, 0, -0.6],
        ...seq(lf, [
          [0, 'walk', 'smirk'],
          [36, 'cross', 'smirk'],
          [W('refusal', 'ridiculous'), 'point', 'smirk']
        ]),
        talk: lf >= W('refusal', 'ridiculous'),
        gaze: [gx, 1.4, -0.6]
      });

      P.push({
        who: 'grandma',
        p: [gx, 0, -0.6],
        ...seq(lf, [
          [0, 'walk', 'smug'],
          [36, 'talk', 'smug'],
          [W('refusal', 'baby'), 'shrug', 'smug']
        ]),
        talk: lf >= W('refusal', 'baby'),
        gaze: [sx2, 1.4, -0.6]
      });

      Ct.push({
        p: [-1.15, 0, -0.2],
        ry: 0.25,
        fill: 0
      });
      break;
    }

    case 'revolution': {
      // INSIDE STORE (z=-0.8..-0.4): Goldman cheering; youngwoman happily pushing full cart; coins bursting
      const yx = lerp(1.15, 0.3, cl(lf / 75));
      const cx = yx - 0.35;
      P.push({
        who: 'goldman',
        p: [-0.75, 0, -0.8],
        ...seq(lf, [
          [0, 'cheer', 'grin'],
          [W('revolution', 'billion'), 'proud', 'grin']
        ]),
        gaze: 'cam'
      });

      P.push({
        who: 'youngwoman',
        p: [yx, 0, -0.4],
        ...seq(lf, [
          [0, 'walk', 'happy'],
          [75, 'cheer', 'grin']
        ]),
        hold: {p: [cx, 0, -0.4], ry: 0, id: 0, k: 0.9},
        gaze: 'cam'
      });

      Ct.push({
        p: [cx, 0, -0.4],
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
