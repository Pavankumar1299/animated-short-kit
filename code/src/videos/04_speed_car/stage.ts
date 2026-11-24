// Staging for 04_speed_car: speeding car trajectory, crash impact, cop reaction, dazed driver
import {TOTAL, shotAt, W} from '../../engine/core/clock';
import {autoGaze} from '../../engine/core/staging';
import {PersonP, seq} from '../../engine/chars/rig';
import type {CarP, MeterP, Things} from '../../engine/kits/downtown/street';
import type {CartP} from '../../engine/kits/grocery/store';
export {TOTAL, shotAt};

export type Stage = {
  people: PersonP[];
  carts: CartP[];
  extra: string[];
  cars: CarP[];
  meters: MeterP[];
  things: Things;
  clock: number;
  nStoryCars: number;
};

export function stage(f: number): Stage {
  const s = shotAt(f), lf = s.lf, P: PersonP[] = [], K: CarP[] = [], Mt: MeterP[] = [], Ex: string[] = [];

  // --- CAR TRAJECTORY ---
  let carX: number;
  let carZ: number;
  let carRy: number;
  let carSpin: number;
  let carDoor = 0;

  if (f < 105) {
    // Stage 1: Speeding down the street (0 to 3.5s)
    const u = f / 105;
    carX = -20.0 + u * 14.0; // from -20 to -6.0
    carZ = 9.45; // Street parking lane
    carRy = 0; // heading +X
    carSpin = f * 2.8;
  } else if (f < 150) {
    // Stage 2: Swerving toward tree at [3.5, 0, 7.8] (3.5s to 5.0s)
    const u = (f - 105) / 45;
    carX = -6.0 + u * 7.4; // reaches x = 1.4 (front at x = 3.5)
    carZ = 9.45 - u * 1.65; // reaches z = 7.8
    carRy = -0.22 * Math.sin(u * Math.PI); // swerve angle
    carSpin = 105 * 2.8 + (f - 105) * 1.6;
  } else {
    // Stage 3: Crashed into tree (5.0s to 10.0s)
    carX = 1.4;
    carZ = 7.8;
    carRy = -0.15;
    carSpin = 105 * 2.8 + 45 * 1.6; // wheels stopped
    carDoor = Math.min(0.8, (f - 158) * 0.05); // driver's door creaks open
  }

  // The Speed Car (car 0)
  K.push({
    p: [carX, 0, carZ],
    ry: carRy,
    col: '#c8241e', // Race car red
    spin: carSpin,
    door: carDoor,
    driver: '#f2b234' // Young driver inside
  });

  // Background parked car safely far ahead on the block
  K.push({
    p: [16.0, 0, 9.45],
    ry: Math.PI,
    col: '#2f4f6a'
  });

  // --- CHARACTERS ---
  // Spectator: Old Man safely back on the wide sidewalk
  P.push({
    who: 'oldman',
    p: [-4.5, 0, 5.6],
    ...seq(lf, [
      [0, 'idle', 'shock'],
      [W('speeding', 'speedster'), 'shrug', 'surprised']
    ]),
    gaze: [carX, 0.8, carZ]
  });

  // Cop safely on the sidewalk near the store entrance
  P.push({
    who: 'cop',
    p: [-2.2, 0, 5.6],
    ...seq(lf, [
      [0, 'idle', 'smirk'],
      [W('crash', 'century-old') ?? 0, 'talk', 'shock'],
      [W('aftermath', 'tree') ?? 0, 'talk', 'smug'],
      [W('aftermath', 'lose') ?? 0, 'present', 'grin']
    ]),
    gaze: [carX, 0.8, carZ]
  });

  autoGaze(P, Mt);

  return {
    people: P,
    carts: [],
    extra: Ex,
    cars: K,
    meters: Mt,
    things: {},
    clock: 14 + f / 30 / 60,
    nStoryCars: 1
  };
}
