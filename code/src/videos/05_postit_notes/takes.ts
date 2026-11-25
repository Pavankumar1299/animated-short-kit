import {K, type Take, type Kick, type Whip, type Flash, type Props} from '../../engine/camera/takes_api';
import {T} from '../../engine/core/clock';
import {SHOT_REAL as R} from './timeline';

export const PROPS: Props = {};

// Ricks Clips camera grammar: 77% moving, multi-key takes with low-angle CUs, fast pullpush reveals, and arcs
export const TAKES: Take[] = [
  {
    name: 'lab',
    why: 'HARDWARE lab: follow Spencer Silver walking in, fast push-in to MCU on weak glue',
    keys: [
      K(R.lab, 'magee', 'MS', -16, 4, 42, {push: 1.06}),
      K(T('lab', 'invent'), 'magee', 'MCU', 8, -2, 36, {move: 'arc', lead: 0.25, dur: 0.75, push: 1.08}),
      K(T('lab', 'weakest'), 'magee', 'CU', -6, 2, 34, {move: 'dolly', lead: 0.2, dur: 0.65, push: 1.06})
    ]
  },
  {
    name: 'mockery',
    why: 'FIRST NATIONAL BANK: tight CU on mocking boss, pull-back reveal of both, arc back to boss',
    keys: [
      K(R.mockery, 'banker', 'MCU', 14, -2, 38, {push: 1.06}),
      K(T('mockery', 'face'), ['magee', 'banker'], 'FS', -12, 6, 44, {move: 'pullpush', lead: 0.25, dur: 0.7, push: 1.05}),
      K(T('mockery', 'stick!'), 'banker', 'CU', 18, 2, 36, {move: 'arc', lead: 0.25, dur: 0.7, push: 1.06})
    ]
  },
  {
    name: 'choir',
    why: 'MENS WEAR far sidewalk (az ~ 180): show both, arc to Art Fry, push-in on bookmarks',
    keys: [
      K(R.choir, ['preacher', 'youngwoman'], 'FS', 172, 6, 44, {push: 1.05}),
      K(T('choir', 'bookmarks'), 'preacher', 'MS', -168, 5, 40, {move: 'arc', lead: 0.3, dur: 0.85, push: 1.06}),
      K(T('choir', 'choir'), 'preacher', 'MCU', 175, -2, 38, {move: 'dolly', lead: 0.25, dur: 0.75, push: 1.06})
    ]
  },
  {
    name: 'eureka',
    why: 'MENS WEAR far sidewalk: low-angle MCU on Eureka moment, fast pull-back reveal with cheering partner',
    keys: [
      K(R.eureka, 'preacher', 'MCU', 172, -2, 38, {push: 1.07}),
      K(T('eureka', 'yellow'), ['preacher', 'youngwoman'], 'FS', -168, 6, 44, {move: 'pullpush', lead: 0.25, dur: 0.75, push: 1.05})
    ]
  },
  {
    name: 'success',
    why: 'OFFICE SUPPLY far sidewalk: triumphant push-out reveal with swirling Post-it storm',
    keys: [
      K(R.success, 'magee', 'MCU', 168, 2, 38, {push: 1.06}),
      K(T('success', 'Post-it'), ['magee', 'preacher'], 'FS', -170, 7, 45, {move: 'pullpush', lead: 0.3, dur: 0.85, push: 1.05})
    ]
  }
];

export const KICKS: Kick[] = [{t: 21.0, a: 2.2, z: 0.08}];
export const WHIPS: Whip[] = [];
export const FLASHES: Flash[] = [{t: 21.0, a: 0.55}];
