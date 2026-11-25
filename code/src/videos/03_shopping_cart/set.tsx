// Set and props for 03_shopping_cart: grocery store, downtown block, shopping carts and extras
import React from 'react';
import * as THREE from 'three';
import type {Tod} from '../../engine/look/look';
import {useMats, Set, Cart, Extras, type Mats} from '../../engine/kits/grocery/store';
import {Town, StreetClock} from '../../engine/kits/downtown/town';
import {Car} from '../../engine/kits/downtown/street';
import type {Stage} from './stage';

export const AUDIO: {voice: string | null; bed: string | null} = {
  voice: '03_shopping_cart/voice.wav',
  bed: '03_shopping_cart/bed.wav'
};
export const useSetData = () => useMats();

type P = {d: Mats; f: number; st: Stage; cam: THREE.Vector3; vel: (THREE.Vector3 | null)[]; tod: Tod};

export const SetBefore: React.FC<P> = ({d, f, st, tod}) => (
  <>
    <Set m={d} f={f} />
    <Town tod={tod} />
    <StreetClock hours={st.clock} />
    {st.cars.map((c, i) => (
      <Car key={i} c={c} />
    ))}
    {st.carts.map((c, i) => (
      <Cart key={i} m={d} c={c} f={f} />
    ))}
    <Extras m={d} f={f} x={st.extra} />
  </>
);

export const SetAfter: React.FC<P> = () => null;
