// Measured camera takes INSIDE the grocery store (az -22..22 looking -z down the stocked aisles)
import {K, type Take, type Kick, type Whip, type Flash, type Props} from '../../engine/camera/takes_api';
import {T} from '../../engine/core/clock';
import {SHOT_REAL as R} from './timeline';

export const PROPS: Props = {};

export const TAKES: Take[] = [
  {
    name: 'hook',
    why: 'INSIDE STORE: Goldman presenting new cart, arc to shopper pushing cart down aisle',
    keys: [
      K(R.hook, 'goldman', 'MS', 20, 5, 42, {push: 1.05}),
      K(T('hook', 'push'), 'shopper', 'MS', -18, 5, 40, {move: 'arc', lead: 0.3, dur: 0.85, push: 1.05})
    ]
  },
  {
    name: 'refusal',
    why: 'INSIDE STORE: real customers scoffing at the cart, tight push on mocking expressions',
    keys: [
      K(R.refusal, ['shopper2', 'grandma'], 'MS', -20, 5, 40, {push: 1.05}),
      K(T('refusal', 'ridiculous'), 'shopper2', 'MCU', -15, -2, 36, {move: 'dolly', lead: 0.25, dur: 0.8, push: 1.06})
    ]
  },
  {
    name: 'revolution',
    why: 'INSIDE STORE: Goldman cheering, full cart packed with groceries, pull-back reveal of aisles',
    keys: [
      K(R.revolution, 'goldman', 'MS', 15, 5, 40, {push: 1.05}),
      K(T('revolution', 'billion'), ['goldman', 'youngwoman'], 'FS', -20, 6, 44, {move: 'pullpush', lead: 0.35, dur: 1.0, push: 1.04})
    ]
  }
];

export const KICKS: Kick[] = [];
export const WHIPS: Whip[] = [];
export const FLASHES: Flash[] = [];
