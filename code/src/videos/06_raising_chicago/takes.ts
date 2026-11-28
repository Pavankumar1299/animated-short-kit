import {K, type Take, type Kick, type Whip, type Flash, type Props} from '../../engine/camera/takes_api';
import {T} from '../../engine/core/clock';
import {SHOT_REAL as R} from './timeline';

export const PROPS: Props = {};

export const TAKES: Take[] = [
  {
    name: 'mud',
    why: '1856 muddy street: track engineer trudging, pull back to show sinking houses',
    keys: [
      K(R.mud, 'magee', 'MS', -24, 5, 40, {push: 1.06}),
      K(T('mud', 'mud,'), ['magee', 'man'], 'FS', 28, 7, 44, {move: 'pullpush', lead: 0.25, dur: 0.8, push: 1.05})
    ]
  },
  {
    name: 'mockery',
    why: 'Mayor laughs at engineer: confrontation & reaction cut',
    keys: [
      K(R.mockery, ['magee', 'banker'], 'MS', 26, 4, 40, {push: 1.06}),
      K(T('mockery', 'crazy!'), 'banker', 'MCU', 18, -2, 36, {move: 'arc', lead: 0.25, dur: 0.65, push: 1.07})
    ]
  },
  {
    name: 'jacks',
    why: '600 men cranking screw jacks lifting entire .glb houses into the sky',
    keys: [
      K(R.jacks, ['mechanic', 'magee', 'man'], 'FS', -30, 8, 44, {push: 1.05}),
      K(T('jacks', 'sky.'), ['mechanic', 'magee', 'man'], 'WS', 25, 10, 46, {move: 'arc', lead: 0.3, dur: 0.9, push: 1.04})
    ]
  },
  {
    name: 'dinner',
    why: 'Inside rising house dining room: grandma & kid eating soup undisturbed',
    keys: [
      K(R.dinner, ['grandma', 'kid'], 'MS', -18, 5, 40, {push: 1.05}),
      K(T('dinner', 'soup!'), ['grandma', 'kid'], 'FS', 16, 4, 42, {move: 'arc', lead: 0.25, dur: 0.75, push: 1.06})
    ]
  },
  {
    name: 'city',
    why: 'Elevated 1860 Chicago finale: high-angle pull-back revealing raised .glb neighborhood',
    keys: [
      K(R.city, 'magee', 'MCU', -18, 2, 38, {push: 1.06}),
      K(T('city', 'greatest'), ['magee', 'banker'], 'WS', 28, 12, 46, {move: 'pullpush', lead: 0.3, dur: 0.85, push: 1.04})
    ]
  }
];

export const KICKS: Kick[] = [];
export const WHIPS: Whip[] = [];
export const FLASHES: Flash[] = [{t: 24.9, a: 0.45}];
