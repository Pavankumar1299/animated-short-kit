import {K, type Take, type Kick, type Whip, type Flash, type Props} from '../../engine/camera/takes_api';
import {T} from '../../engine/core/clock';
import {SHOT_REAL as R} from './timeline';

export const PROPS: Props = {};

// Round 5: Indoor Lab (az -22..25 looking -z), Indoor Church (az -24..28 looking -z), and Office Finale
export const TAKES: Take[] = [
  {
    name: 'lab',
    why: 'INSIDE Chemistry Lab: Spencer Silver inspecting glowing beaker, push-in on sweat reaction',
    keys: [
      K(R.lab, 'magee', 'MS', -24, 4, 42, {push: 1.06}),
      K(T('lab', 'invent'), 'magee', 'MCU', 18, 2, 38, {move: 'arc', lead: 0.25, dur: 0.8, push: 1.08}),
      K(T('lab', 'weakest'), 'magee', 'MS', -16, 5, 42, {move: 'pullpush', lead: 0.2, dur: 0.7, push: 1.05})
    ]
  },
  {
    name: 'mockery',
    why: 'INSIDE Chemistry Lab: boss mocks, arc to magee reaction',
    keys: [
      K(R.mockery, ['magee', 'banker'], 'MS', 22, 4, 42, {push: 1.06}),
      K(T('mockery', 'Congratulations'), 'banker', 'MCU', 18, -2, 38, {move: 'arc', lead: 0.25, dur: 0.65, push: 1.07}),
      K(T('mockery', 'stick!'), 'magee', 'MCU', -20, 2, 38, {move: 'arc', lead: 0.2, dur: 0.6, push: 1.06})
    ]
  },
  {
    name: 'choir',
    why: 'INSIDE Church Sanctuary: Art Fry pacing in front of stained glass & pews, push-in on falling bookmarks',
    keys: [
      K(R.choir, ['youngman', 'youngwoman', 'grandma'], 'FS', -22, 6, 44, {push: 1.05}),
      K(T('choir', 'bookmarks'), 'youngman', 'MS', 20, 4, 40, {move: 'arc', lead: 0.3, dur: 0.85, push: 1.06}),
      K(T('choir', 'choir'), 'youngman', 'MCU', -16, -2, 38, {move: 'dolly', lead: 0.25, dur: 0.75, push: 1.06})
    ]
  },
  {
    name: 'eureka',
    why: 'INSIDE Church Sanctuary: low-angle MCU on Art Fry breakthrough, pull-back reveal with choir',
    keys: [
      K(R.eureka, 'youngman', 'MCU', -18, -2, 38, {push: 1.07}),
      K(T('eureka', 'yellow'), ['youngman', 'youngwoman'], 'FS', 22, 6, 44, {move: 'pullpush', lead: 0.25, dur: 0.75, push: 1.05})
    ]
  },
  {
    name: 'success',
    why: 'Post-it Finale: pull-back reveal with swirling storm of yellow notes',
    keys: [
      K(R.success, 'magee', 'MCU', 160, 3, 38, {push: 1.06}),
      K(T('success', 'Post-it'), ['magee', 'youngman'], 'FS', 152, 10, 45, {move: 'pullpush', lead: 0.3, dur: 0.85, push: 1.05})
    ]
  }
];

export const KICKS: Kick[] = [{t: 21.0, a: 2.2, z: 0.08}];
export const WHIPS: Whip[] = [];
export const FLASHES: Flash[] = [{t: 21.0, a: 0.55}];
