import { createReducer } from 'redux-act';
import { updatePockets } from './actions';
import { PocketsType } from './types';

const initialValue: PocketsType = {
  USD: 100,
  EUR: 50.5,
  GBP: 200,
};

export const pocketsReducer = createReducer({}, initialValue);

pocketsReducer.on(updatePockets, (state, payload) => ({
  ...state,
  [payload.fromPocket]: parseFloat(
    (
      state[payload.fromPocket as keyof PocketsType] - payload.fromValue
    ).toFixed(2),
  ),
  [payload.toPocket]: parseFloat(
    (state[payload.toPocket as keyof PocketsType] + payload.toValue).toFixed(2),
  ),
}));
