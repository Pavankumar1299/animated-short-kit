import {K, type Take, type Kick, type Whip, type Flash, type Props} from '../../engine/camera/takes_api';
import {T} from '../../engine/core/clock';
import {SHOT_REAL as R} from './timeline';

export const PROPS: Props = {};

export const TAKES: Take[] = [
  {
    name: 'lab',
    why: 'Spencer Silver walks up to lab bench inspecting weak glue',
    keys: [
      K(R.lab, 'magee', 'MS', 0, 4, 40, {push: 1.05}),
      K(T('lab', 'strongest'), 'magee', 'MCU', 0, 4, 38, {move: 'dolly', lead: 0.25, dur: 0.8, push: 1.05})
    ]
  },
  {
    name: 'mockery',
    why: 'boss struts in, laughs and mocks the useless glue',
    keys: [
      K(R.mockery, ['magee', 'banker'], 'FS', 12, 7, 44, {push: 1.05}),
      K(T('mockery', 'invented'), 'banker', 'MS', 10, 4, 40, {move: 'arc', lead: 0.3, dur: 0.85, push: 1.05})
    ]
  },
  {
    name: 'choir',
    why: 'Art Fry paces in frustration with falling bookmarks',
    keys: [
      K(R.choir, ['preacher', 'youngwoman'], 'FS', 8, 6, 42, {push: 1.05}),
      K(T('choir', 'choir'), 'preacher', 'MCU', 0, 4, 38, {move: 'arc', lead: 0.3, dur: 0.8, push: 1.05})
    ]
  },
  {
    name: 'eureka',
    why: 'applying yellow note to hymnbook, Eureka breakthrough',
    keys: [
      K(R.eureka, 'preacher', 'MCU', 0, 4, 38, {push: 1.06}),
      K(T('eureka', 'yellow'), ['preacher', 'youngwoman'], 'FS', -8, 6, 42, {move: 'dolly', lead: 0.25, dur: 0.8, push: 1.04})
    ]
  },
  {
    name: 'success',
    why: 'triumphant celebration with swirling storm of yellow notes',
    keys: [
      K(R.success, ['magee', 'preacher'], 'FS', 10, 7, 44, {push: 1.06})
    ]
  }
];

export const KICKS: Kick[] = [];
export const WHIPS: Whip[] = [];
export const FLASHES: Flash[] = [{t: 21.0, a: 0.5}];
