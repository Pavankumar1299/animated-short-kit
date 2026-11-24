// Staging for 03_shopping_cart: characters, positions, gestures, expressions per frame
import {TOTAL, shotAt, W} from '../../engine/core/clock';
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

export function stage(f: number): Stage {
  const s = shotAt(f), lf = s.lf, P: PersonP[] = [], K: CarP[] = [], Ct: CartP[] = [], Mt: MeterP[] = [], Ex: string[] = [];

  // Street parking context
  K.push(
    {p: [6.75, 0, 9.45], ry: Math.PI, col: '#2f4f6a'},
    {p: [-6.75, 0, 9.45], ry: Math.PI, col: '#a8443a'}
  );

  switch (s.name) {
    case 'hook':
      // Goldman proudly presenting; paid female shopper pushing empty cart
      P.push({
        who: 'goldman',
        p: [-0.65, 0, 7.4],
        ...seq(lf, [
          [0, 'present', 'proud'],
          [W('hook', 'push'), 'talk', 'happy']
        ]),
        gaze: 'cam'
      });

      P.push({
        who: 'shopper',
        p: [0.85, 0, 7.4],
        ...seq(lf, [
          [0, 'idle', 'happy'],
          [W('hook', 'push') - 6, 'walk', 'grin']
        ]),
        hold: {p: [0.55, 0, 7.4], ry: 0, id: 0, k: 0.9},
        gaze: 'cam'
      });

      Ct.push({
        p: [0.55, 0, 7.4],
        ry: 0,
        fill: 0
      });
      break;

    case 'refusal':
      // Real customers scoffing and crossing arms at the parked cart
      P.push({
        who: 'shopper2',
        p: [-0.6, 0, 7.4],
        ...seq(lf, [
          [0, 'cross', 'smirk'],
          [W('refusal', 'ridiculous'), 'point', 'smirk']
        ]),
        gaze: [0.85, 1.4, 7.4]
      });

      P.push({
        who: 'woman',
        p: [0.85, 0, 7.4],
        ...seq(lf, [
          [0, 'talk', 'smug'],
          [W('refusal', 'baby'), 'shrug', 'smug']
        ]),
        gaze: [-0.6, 1.4, 7.4]
      });

      // Parked empty cart they refuse to touch
      Ct.push({
        p: [-1.75, 0, 7.4],
        ry: 0.2,
        fill: 0
      });
      break;

    case 'revolution':
      // Trick worked: Goldman cheering; customer happily pushing full cart; coins bursting
      P.push({
        who: 'goldman',
        p: [-0.65, 0, 7.4],
        ...seq(lf, [
          [0, 'cheer', 'grin'],
          [W('revolution', 'billion'), 'proud', 'grin']
        ]),
        gaze: 'cam'
      });

      P.push({
        who: 'woman',
        p: [0.85, 0, 7.4],
        ...seq(lf, [
          [0, 'walk', 'happy'],
          [W('revolution', 'billion'), 'cheer', 'grin']
        ]),
        hold: {p: [0.55, 0, 7.4], ry: 0, id: 0, k: 0.9},
        gaze: 'cam'
      });

      // Loaded grocery cart
      Ct.push({
        p: [0.55, 0, 7.4],
        ry: 0,
        fill: 1
      });

      Ex.push('coins', 'bulb');
      break;
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
