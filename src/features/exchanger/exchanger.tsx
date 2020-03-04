import React, { useState, useEffect } from 'react';
import { convert } from 'cashify';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { colors } from 'lib/theme';
import { Button, Card, Input } from 'ui';
import { PocketsList, updatePockets } from 'features/pockets';
import { PocketsType } from 'features/pockets/types';
import { State } from 'features/store';
import { formatCurrency } from 'lib/currency/format-currency';
import { EUR, USD } from 'lib/currency';

import { useErrors, useNotEnoughMoney, useFetchRates } from './hooks';

const formatInputValue = (value: string) => value.replace(',', '.').trim();

export const Exchanger = () => {
  const pockets = useSelector((state: State) => state.pockets);
  const dispatch = useDispatch();

  const [fromPocket, setFromPocket] = useState(USD);
  const [toPocket, setToPocket] = useState(EUR);

  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

  const { fromError, toError } = useErrors(fromValue, toValue);
  const { rates, isRatesFetching } = useFetchRates(fromPocket);
  const notEnoughMoney = useNotEnoughMoney(
    pockets[fromPocket as keyof PocketsType],
    fromValue,
  );

  const handleClickFromPocket = (fromPocket: string) => {
    if (fromPocket === toPocket) {
      setToPocket(
        Object.keys(pockets).filter(pocketKey => fromPocket !== pocketKey)[0],
      );
    }

    setFromPocket(fromPocket);
  };

  const convertValue = (value: string, isReversed = false): string => {
    if (!value) return '';

    const convertedValue = parseFloat(
      convert(parseFloat(value), {
        from: isReversed ? toPocket : fromPocket,
        to: isReversed ? fromPocket : toPocket,
        base: fromPocket,
        rates,
      }).toFixed(2),
    );

    return Number.isInteger(convertedValue)
      ? convertedValue.toString()
      : convertedValue.toFixed(2);
  };

  useEffect(() => {
    setToValue(convertValue(fromValue));
  }, [rates, toPocket]); //eslint-disable-line react-hooks/exhaustive-deps

  const handleFromValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const formattedValue = formatInputValue(value);

    setFromValue(formattedValue);
    setToValue(convertValue(formattedValue));
  };

  const handleToValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const formattedValue = formatInputValue(value);

    setToValue(formattedValue);
    setFromValue(convertValue(formattedValue, true));
  };

  const handleButtonClick = () => {
    dispatch(
      updatePockets({
        fromPocket,
        toPocket,
        fromValue: parseFloat(fromValue),
        toValue: parseFloat(toValue),
      }),
    );
  };

  const buttonMessage = fromValue
    ? `Convert ${formatCurrency(parseFloat(fromValue), fromPocket)} to 
  ${formatCurrency(parseFloat(toValue), toPocket)}`
    : 'Type money amount';

  return (
    <ExchangerCard>
      <Title>From</Title>
      <PocketsList
        pockets={pockets}
        activePocket={fromPocket}
        onClick={handleClickFromPocket}
      />
      <Divider />
      <Title>To</Title>
      <PocketsList
        pockets={pockets}
        activePocket={toPocket}
        disabledPocket={fromPocket}
        onClick={setToPocket}
      />
      <Divider />
      <Rate>
        {formatCurrency(1, fromPocket)} ={' '}
        {formatCurrency(
          parseFloat(rates[toPocket as keyof PocketsType].toFixed(2)),
          toPocket,
        )}
      </Rate>
      <Divider />
      <InputsContainer>
        <InputWrapper>
          <Input
            value={fromValue}
            onChange={handleFromValueChange}
            placeholder={`From ${fromPocket}`}
            error={fromError || notEnoughMoney}
          />
        </InputWrapper>
        <InputWrapper>
          <Input
            value={toValue}
            onChange={handleToValueChange}
            placeholder={`To ${toPocket}`}
            error={toError}
          />
        </InputWrapper>
      </InputsContainer>
      <Button
        onClick={handleButtonClick}
        disabled={Boolean(!fromValue || isRatesFetching || notEnoughMoney)}
      >
        {buttonMessage}
      </Button>
    </ExchangerCard>
  );
};

const ExchangerCard = styled(Card)`
  width: 500px;

  padding: 20px 15px;
  margin: 25px auto;
`;

const InputsContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const InputWrapper = styled.div`
  flex: 1;

  & + & {
    margin-left: 15px;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  margin: 20px 0;
  background-color: ${colors.strokeGray};
`;

const Title = styled.h1`
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 10px;
`;

const Rate = styled.div`
  color: ${colors.green};
  text-align: center;
`;
