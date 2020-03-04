import styled from 'styled-components';
import { ifProp } from 'styled-tools';
import { colors } from 'lib/theme';

const Button = styled.button`
  appearance: none;

  display: flex;
  align-items: center;
  justify-content: center;

  max-width: 100%;
  min-height: 47px;
  width: 100%;
  padding: 15px;

  cursor: pointer;
  color: ${colors.white};
  background-color: ${colors.blue};

  border-radius: 5px;

  font-size: 14px;
  font-weight: 500;

  opacity: ${ifProp('disabled', 0.5, 1)};

  transition: all 0.15s ease-in-out;

  &:disabled {
    cursor: default;
  }

  &:hover:enabled,
  &:focus:enabled {
    opacity: 0.8;
    box-shadow: 0 10px 30px rgba(184, 193, 204, 0.4);
  }

  &:active:enabled {
    opacity: 0.9;
  }
`;

export { Button };
