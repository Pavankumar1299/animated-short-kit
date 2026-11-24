// Staging for 02_sliced_bread: characters, positions, gestures, expressions per frame
import {TOTAL, shotAt, W, type V3} from '../../engine/core/clock';
import {autoGaze} from '../../engine/core/staging';
import {PersonP, seq} from '../../engine/chars/rig';
import type {CarP, MeterP, Things} from '../../engine/kits/downtown/street';
import type {CartP} from '../../engine/kits/grocery/store';
export {TOTAL, shotAt};

export type Stage = {people: PersonP[]; carts: CartP[]; extra: string[]; cars: CarP[]; meters: MeterP[]; things: Things; clock: number; nStoryCars: number};

export function stage(f: number): Stage {
  const s = shotAt(f), lf = s.lf, P: PersonP[] = [], K: CarP[] = [], Mt: MeterP[] = [];
  // 1930s downtown parked cars for street realism
  K.push(
    {p: [6.75, 0, 9.45], ry: Math.PI, col: '#2f4f6a'},
    {p: [-6.75, 0, 9.45], ry: Math.PI, col: '#a8443a'},
    {p: [12.0, 0, 9.45], ry: Math.PI, col: '#4a6b4a'}
  );

  switch (s.name) {
    case 'hook':
      // Otto presenting his cutter; skeptical baker mocking him
      P.push({
        who: 'magee',
        p: [-0.6, 0, 7.4],
        ...seq(lf, [
          [0, 'present', 'proud'],
          [W('hook', 'cuts') + 5, 'talk', 'proud']
        ]),
        gaze: 'cam'
      });
      P.push({
        who: 'baker',
        p: [0.8, 0, 7.6],
        ...seq(lf, [
          [0, 'idle', 'smug'],
          [W('hook', 'town') + 5, 'cross', 'smirk']
        ]),
        gaze: [-0.6, 1.4, 7.4]
      });
      break;

    case 'mockery':
      // Otto working in shop; baker points and mocks
      P.push({
        who: 'magee',
        p: [-0.5, 0, 7.4],
        ...seq(lf, [
          [0, 'think', 'worried'],
          [W('mockery', 'problem') + 5, 'talk', 'neutral']
        ]),
        gaze: [0.2, 0.8, 7.4]
      });
      P.push({
        who: 'baker',
        p: [0.9, 0, 7.6],
        ...seq(lf, [
          [0, 'idle', 'smug'],
          [W('mockery', 'laughed') + 5, 'point', 'smug'],
          [W('mockery', 'minutes') + 5, 'cheer', 'grin']
        ]),
        gaze: [-0.5, 1.4, 7.4]
      });
      break;

    case 'disaster':
      // Factory fire destroys prototype; Otto in shock, friends advise giving up
      P.push({
        who: 'magee',
        p: [-0.3, 0, 7.5],
        ...seq(lf, [
          [0, 'slump', 'shock'],
          [W('disaster', 'ashes') + 5, 'tired', 'sad']
        ]),
        gaze: 'cam'
      });
      P.push({
        who: 'shopper2',
        p: [1.0, 0, 7.6],
        ...seq(lf, [
          [0, 'idle', 'worried'],
          [W('disaster', 'broke') + 5, 'shrug', 'worried']
        ]),
        gaze: [-0.3, 1.4, 7.5]
      });
      P.push({
        who: 'youngman',
        p: [-1.4, 0, 7.8],
        ...seq(lf, [
          [0, 'cross', 'tired']
        ]),
        gaze: [-0.3, 1.4, 7.5]
      });
      break;

    case 'theturn':
      // Otto's epiphany: mothers struggle cutting bread -> redesign with blades + wax paper
      P.push({
        who: 'woman',
        p: [-0.6, 0, 7.4],
        ...seq(lf, [
          [0, 'tired', 'tired'],
          [W('theturn', 'week') + 5, 'slump', 'tired']
        ]),
        gaze: [-0.6, 0.8, 7.1]
      });
      P.push({
        who: 'magee',
        p: [0.8, 0, 7.5],
        ...seq(lf, [
          [0, 'think', 'neutral'],
          [W('theturn', 'secret') + 5, 'eureka', 'surprised'],
          [W('theturn', 'redesigned') + 5, 'present', 'proud']
        ]),
        gaze: 'cam'
      });
      break;

    case 'climax':
      // Chillicothe bakery trial: pre-sliced loaves sell out in 90 mins; crowd queues up
      P.push({
        who: 'banker',
        p: [-0.6, 0, 7.4],
        ...seq(lf, [
          [0, 'present', 'proud'],
          [W('climax', 'minutes') + 5, 'cheer', 'happy']
        ]),
        gaze: 'cam'
      });
      P.push({
        who: 'woman',
        p: [0.7, 0, 7.5],
        ...seq(lf, [
          [0, 'bounce', 'happy']
        ]),
        gaze: [-0.6, 1.3, 7.4]
      });
      P.push({
        who: 'baker',
        p: [2.0, 0, 7.6],
        ...seq(lf, [
          [0, 'idle', 'shock'],
          [W('climax', 'mocked') + 5, 'slump', 'worried']
        ]),
        gaze: [-0.6, 1.3, 7.4]
      });
      P.push({
        who: 'oldman',
        p: [3.2, 0, 7.8],
        act: 'idle',
        expr: 'happy',
        gaze: [-0.6, 1.3, 7.4]
      });
      break;

    case 'ending':
      // Otto proud with the greatest thing since sliced bread
      P.push({
        who: 'magee',
        p: [0, 0, 7.5],
        ...seq(lf, [
          [0, 'present', 'proud'],
          [W('ending', 'genius') + 5, 'cheer', 'grin']
        ]),
        gaze: 'cam'
      });
      break;
  }

  autoGaze(P, Mt);
  return {people: P, carts: [], extra: [], cars: K, meters: Mt, things: {}, clock: 9 + f / 30 / 120, nStoryCars: K.length};
}
