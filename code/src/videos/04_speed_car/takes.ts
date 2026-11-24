// Measured takes: tracking speedster, crash flash & shake, cop ticket reveal
import {K, type Take, type Kick, type Whip, type Flash, type Props} from '../../engine/camera/takes_api';
import {T} from '../../engine/core/clock';
import {SHOT_REAL as R} from './timeline';

export const PROPS: Props = {};

export const TAKES: Take[] = [
  {
    name: 'speeding',
    why: 'establish spectator old man, angle down avenue to crimson speedster rocketing past',
    keys: [
      K(R.speeding, 'oldman', 'MS', 25, 5, 40, {push: 1.05}),
      K(T('speeding', 'speedster'), 'car:0', 'MS', 72, 6, 42, {move: 'arc', lead: 0.3, dur: 0.85, push: 1.05})
    ]
  },
  {
    name: 'crash',
    why: 'car loses control and slams into tree with violent kick and flash',
    keys: [
      K(R.crash, 'car:0', 'MS', 65, 6, 42, {push: 1.05}),
      K(T('crash', 'century-old'), 'car:0', 'MCU', 55, 5, 38, {move: 'dolly', lead: 0.25, dur: 0.8, push: 1.06})
    ]
  },
  {
    name: 'aftermath',
    why: 'cop looking at smoking wreck and writing ticket, reveal dazed driver inside',
    keys: [
      K(R.aftermath, 'cop', 'MS', 20, 5, 40, {push: 1.05}),
      K(T('aftermath', 'lose'), 'cop', 'FS', 25, 6, 44, {move: 'arc', lead: 0.35, dur: 1.0, push: 1.04})
    ]
  }
];

// Impact flash at 5.0 seconds
export const FLASHES: Flash[] = [{t: 5.0, a: 0.85}];

// Camera kick / earthquake shake at 5.0 seconds
export const KICKS: Kick[] = [{t: 5.0, a: 4.2, z: 0.14}];

export const WHIPS: Whip[] = [];
