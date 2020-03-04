import { createAction } from 'redux-act';

interface UpdatePocketsPayload {
  fromValue: number;
  toValue: number;
  fromPocket: string;
  toPocket: string;
}

export const updatePockets = createAction<UpdatePocketsPayload>(
  'set the currencies pockets',
);
