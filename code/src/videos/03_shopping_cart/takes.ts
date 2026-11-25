// Measured camera takes matching references/03_CAMERA_GRAMMAR.md
import {K, type Take, type Kick, type Whip, type Flash, type Props} from '../../engine/camera/takes_api';
import {T} from '../../engine/core/clock';
import {SHOT_REAL as R} from './timeline';

export const PROPS: Props = {};

export const TAKES: Take[] = [
  {
    name: 'hook',
    why: 'establish Goldman presenting new cart, travel to paid stranger wheeling empty cart',
    keys: [
      K(R.hook, 'goldman', 'FS', 18, 6, 42, {push: 1.05}),
      K(T('hook', 'push'), 'shopper', 'MS', -15, 5, 38, {move: 'arc', lead: 0.3, dur: 0.85, push: 1.05})
    ]
  },
  {
    name: 'refusal',
    why: 'real customers scoffing and refusing to touch carts, tight push on mocking expressions',
    keys: [
      K(R.refusal, ['shopper2', 'grandma'], 'MS', -20, 5, 40, {push: 1.05}),
      K(T('refusal', 'ridiculous'), 'shopper2', 'MCU', -15, 3.5, 36, {move: 'dolly', lead: 0.25, dur: 0.8, push: 1.06})
    ]
  },
  {
    name: 'revolution',
    why: 'Goldman cheering, full carts packed with groceries, pull-back reveal of bustling store',
    keys: [
      K(R.revolution, 'goldman', 'MS', 15, 5, 40, {push: 1.05}),
      K(T('revolution', 'billion'), ['goldman', 'youngwoman'], 'FS', -22, 7, 44, {move: 'pullpush', lead: 0.35, dur: 1.0, push: 1.04})
    ]
  }
];

export const KICKS: Kick[] = [];
export const WHIPS: Whip[] = [];
export const FLASHES: Flash[] = [];
