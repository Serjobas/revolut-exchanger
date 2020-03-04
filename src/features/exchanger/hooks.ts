import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useUpdate } from 'lib/custom-hooks';

const pattern = /^[0-9]+((.|,)[0-9]{1,2})?$/;

export function useErrors(fromValue: string, toValue: string) {
  const [fromError, setFromError] = useState('');
  const [toError, setToError] = useState('');

  useUpdate(() => {
    if (fromValue && !fromValue.match(pattern)) {
      setFromError('Invalid money number');
    } else {
      setFromError('');
    }
    if (toValue && !toValue.match(pattern)) {
      setToError('Invalid money number');
    } else {
      setToError('');
    }
  }, [fromValue, toValue]);

  return { fromError, toError };
}

export function useNotEnoughMoney(currentAmount: number, fromValue: string) {
  const [notEnoughMoney, setNotEnoughMoney] = useState('');
  const difference = currentAmount - parseFloat(fromValue);

  // console.log(currentAmount, parseFloat(fromValue), difference);

  if (difference < 0 && !notEnoughMoney) {
    setNotEnoughMoney('Not enough money');
  } else if (difference > 0 && notEnoughMoney) {
    setNotEnoughMoney('');
  }

  return notEnoughMoney;
}

export function useFetchRates(fromPocket: string) {
  const ratesInterval = useRef(0);

  const [rates, setRates] = useState({ USD: 1, EUR: 1, GBP: 1 });
  const [isRatesFetching, setIsRatesFetching] = useState(false);

  useEffect(() => {
    clearInterval(ratesInterval.current);

    const fetchRates = () => {
      setIsRatesFetching(true);

      axios
        .get(`https://api.exchangeratesapi.io/latest?base=${fromPocket}`)
        .then(({ data: { rates } }) => {
          setRates({
            USD: rates.USD || 1,
            EUR: rates.EUR || 1,
            GBP: rates.GBP || 1,
          });
          setIsRatesFetching(false);
        });
    };
    fetchRates();

    ratesInterval.current = setInterval(fetchRates, 10000);
  }, [fromPocket]);

  return { rates, isRatesFetching };
}
