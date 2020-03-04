import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { USD, EUR, GBP } from 'lib/currency';

import { PocketsList } from './pockets-list';

const pocketsMock = {
  USD: 1,
  EUR: 10,
  GBP: 100,
};

const fakeOnClick = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

test('click on pocket', async () => {
  const { getByText } = render(
    <PocketsList
      pockets={pocketsMock}
      activePocket={USD}
      disabledPocket={EUR}
      onClick={fakeOnClick}
    />,
  );

  const GBPPocket = getByText(/GBP/);
  fireEvent.click(GBPPocket);

  expect(fakeOnClick).toHaveBeenCalledTimes(1);
  expect(fakeOnClick).toHaveBeenCalledWith(GBP);
});

test('active pocket is disabled', () => {
  const { getByText } = render(
    <PocketsList
      pockets={pocketsMock}
      activePocket={USD}
      onClick={fakeOnClick}
    />,
  );

  const USDPocket = getByText(/USD/);
  fireEvent.click(USDPocket);

  expect(USDPocket).toHaveAttribute('disabled');
  expect(fakeOnClick).toHaveBeenCalledTimes(0);
});

test('disabled pocket is disabled', () => {
  const { getByText } = render(
    <PocketsList
      pockets={pocketsMock}
      activePocket={USD}
      disabledPocket={EUR}
      onClick={fakeOnClick}
    />,
  );

  const EURPocket = getByText(/EUR/);
  fireEvent.click(EURPocket);

  expect(EURPocket).toHaveAttribute('disabled');
  expect(fakeOnClick).toHaveBeenCalledTimes(0);
});

test('snapshot', () => {
  const { container } = render(
    <PocketsList
      pockets={pocketsMock}
      activePocket={USD}
      disabledPocket={EUR}
      onClick={fakeOnClick}
    />,
  );

  expect(container).toMatchSnapshot();
});
