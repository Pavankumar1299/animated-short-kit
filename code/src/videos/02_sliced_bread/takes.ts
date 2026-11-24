// Camera choreography for 02_sliced_bread: measured continuous takes matching references/03_CAMERA_GRAMMAR.md
import {K, type Take, type Kick, type Whip, type Flash, type Props} from '../../engine/camera/takes_api';
import {T} from '../../engine/core/clock';
import {SHOT_REAL as R} from './timeline';

export const PROPS: Props = {};

export const TAKES: Take[] = [
  {
    name: 'hook',
    why: 'establish Otto with machine plan, push in on cuts bread, arc to mocking baker',
    keys: [
      K(R.hook, 'magee', 'FS', 15, 6, 42, {push: 1.05}),
      K(T('hook', 'cuts'), 'baker', 'MS', -15, 4, 38, {move: 'arc', lead: 0.3, dur: 0.8, push: 1.05})
    ]
  },
  {
    name: 'mockery',
    why: 'continuous take in workshop, push in on Otto solving, travel to laughing baker',
    keys: [
      K(R.mockery, 'magee', 'MS', 18, 5, 40, {push: 1.06}),
      K(T('mockery', 'laughed'), 'baker', 'MCU', -20, 3, 38, {move: 'arc', lead: 0.25, dur: 0.75, push: 1.05})
    ]
  },
  {
    name: 'disaster',
    why: 'hard cut to fire aftermath, tilt/dolly onto stunned Otto and concerned friends',
    keys: [
      K(R.disaster, 'magee', 'FS', 10, 7, 42, {push: 1.04}),
      K(T('disaster', 'ashes'), 'magee', 'MCU', 5, 3, 36, {move: 'dolly', lead: 0.3, dur: 0.9, push: 1.06})
    ]
  },
  {
    name: 'theturn',
    why: 'travel from mother struggling with bread to Otto epiphany and synchronized blade design',
    keys: [
      K(R.theturn, 'woman', 'MS', 18, 5, 40, {push: 1.05}),
      K(T('theturn', 'redesigned'), 'magee', 'MS', -15, 5, 40, {move: 'arc', lead: 0.35, dur: 0.95, push: 1.06})
    ]
  },
  {
    name: 'climax',
    why: 'Missouri bakery trial, pre-sliced bread sellout, pull-back reveal long line outside',
    keys: [
      K(R.climax, ['banker', 'woman'], 'MS', 15, 6, 42, {push: 1.05}),
      K(T('climax', 'mocked'), ['baker', 'oldman'], 'FS', -25, 6, 44, {move: 'pullpush', lead: 0.4, dur: 1.1, push: 1.04})
    ]
  },
  {
    name: 'ending',
    why: 'MCU hero push-in on Otto holding perfect bread slice, slow settle on punchline',
    keys: [
      K(R.ending, 'magee', 'MCU', 0, 3, 38, {push: 1.05})
    ]
  }
];

export const KICKS: Kick[] = [];
export const WHIPS: Whip[] = [];
export const FLASHES: Flash[] = [];
