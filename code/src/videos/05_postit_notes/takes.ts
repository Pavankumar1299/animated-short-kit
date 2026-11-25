import {K, type Take, type Kick, type Whip, type Flash, type Props} from '../../engine/camera/takes_api';
import {T} from '../../engine/core/clock';
import {SHOT_REAL as R} from './timeline';

export const PROPS: Props = {};

export const TAKES: Take[] = [
  {
    name: 'lab',
    why: 'Spencer Silver at work bench inspecting weak glue',
    keys: [
      K(R.lab, 'man', 'MCU', 0, 4, 38, {push: 1.05}),
      K(T('lab', 'strongest'), 'man', 'MS', 0, 4, 40, {move: 'dolly', lead: 0.25, dur: 0.8, push: 1.04})
    ]
  },
  {
    name: 'mockery',
    why: 'boss laughs and mocks the useless glue',
    keys: [
      K(R.mockery, ['man', 'goldman'], 'FS', 20, 8, 44, {push: 1.05}),
      K(T('mockery', 'invented'), 'goldman', 'MS', 15, 4, 40, {move: 'arc', lead: 0.3, dur: 0.85, push: 1.05})
    ]
  },
  {
    name: 'choir',
    why: 'Art Fry in choir frustrated with falling bookmarks',
    keys: [
      K(R.choir, 'youngman', 'MS', 0, 4, 40, {push: 1.05}),
      K(T('choir', 'choir'), 'youngman', 'MCU', 0, 4, 38, {move: 'arc', lead: 0.3, dur: 0.8, push: 1.05})
    ]
  },
  {
    name: 'eureka',
    why: 'applying yellow note to page, Eureka breakthrough',
    keys: [
      K(R.eureka, 'youngman', 'MCU', 0, 4, 38, {push: 1.06}),
      K(T('eureka', 'yellow'), 'youngman', 'MS', 0, 4, 40, {move: 'dolly', lead: 0.25, dur: 0.8, push: 1.04})
    ]
  },
  {
    name: 'success',
    why: 'triumphant celebration with storm of yellow notes',
    keys: [
      K(R.success, ['man', 'youngman'], 'FS', 20, 8, 44, {push: 1.06})
    ]
  }
];

export const KICKS: Kick[] = [];
export const WHIPS: Whip[] = [];
export const FLASHES: Flash[] = [{t: 21.0, a: 0.5}];
