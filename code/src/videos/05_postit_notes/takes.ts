import {K, type Take, type Kick, type Whip, type Flash, type Props} from '../../engine/camera/takes_api';
import {T} from '../../engine/core/clock';
import {SHOT_REAL as R} from './timeline';

export const PROPS: Props = {};

// Round 3: 3D street-perspective angles (az +/- 45..65) showing depth down the avenue + prop interaction
export const TAKES: Take[] = [
  {
    name: 'lab',
    why: '3D street angle looking past lab table at Spencer Silver inspecting glowing beaker',
    keys: [
      K(R.lab, 'magee', 'MS', -38, 5, 42, {push: 1.06}),
      K(T('lab', 'invent'), 'magee', 'MCU', -28, 2, 38, {move: 'arc', lead: 0.25, dur: 0.8, push: 1.08}),
      K(T('lab', 'weakest'), 'magee', 'MS', -42, 6, 42, {move: 'pullpush', lead: 0.2, dur: 0.7, push: 1.05})
    ]
  },
  {
    name: 'mockery',
    why: 'FIRST NATIONAL BANK: 3D street-angle confrontation between banker and magee',
    keys: [
      K(R.mockery, ['magee', 'banker'], 'MS', 32, 3, 40, {push: 1.06}),
      K(T('mockery', 'face'), ['magee', 'banker'], 'FS', 38, 7, 44, {move: 'pullpush', lead: 0.25, dur: 0.75, push: 1.05}),
      K(T('mockery', 'stick!'), 'banker', 'MCU', 26, -2, 38, {move: 'arc', lead: 0.25, dur: 0.7, push: 1.06})
    ]
  },
  {
    name: 'choir',
    why: 'Choir risers across the street: angled 3D view down the sidewalk with singers & falling bookmarks',
    keys: [
      K(R.choir, ['youngman', 'youngwoman'], 'FS', 128, 7, 44, {push: 1.05}),
      K(T('choir', 'bookmarks'), 'youngman', 'MS', 142, 4, 40, {move: 'arc', lead: 0.3, dur: 0.85, push: 1.06}),
      K(T('choir', 'choir'), 'youngman', 'MCU', 155, -2, 38, {move: 'dolly', lead: 0.25, dur: 0.75, push: 1.06})
    ]
  },
  {
    name: 'eureka',
    why: 'Choir podium: low-angle MCU on Art Fry breakthrough, wide 3D pull-back reveal',
    keys: [
      K(R.eureka, 'youngman', 'MCU', 148, -2, 38, {push: 1.07}),
      K(T('eureka', 'yellow'), ['youngman', 'youngwoman'], 'FS', 126, 7, 44, {move: 'pullpush', lead: 0.25, dur: 0.75, push: 1.05})
    ]
  },
  {
    name: 'success',
    why: 'Wide 3D avenue pull-back & crane up showing swirling Post-it storm',
    keys: [
      K(R.success, 'magee', 'MCU', 160, 3, 38, {push: 1.06}),
      K(T('success', 'Post-it'), ['magee', 'youngman'], 'FS', 152, 10, 45, {move: 'pullpush', lead: 0.3, dur: 0.85, push: 1.05})
    ]
  }
];

export const KICKS: Kick[] = [{t: 21.0, a: 2.2, z: 0.08}];
export const WHIPS: Whip[] = [];
export const FLASHES: Flash[] = [{t: 21.0, a: 0.55}];
