import React from 'react';
import styled from 'styled-components';
import { ifProp } from 'styled-tools';
import { colors } from 'lib/theme';

interface InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  error?: string;
  inputRef?: any;
  name?: string;
  pattern?: string;
  min?: string;
}

const Input: React.FC<InputProps> = ({ error, inputRef, ...rest }) => {
  return (
    <Container>
      <InputStyled ref={inputRef} error={Boolean(error)} {...rest} />
      {error && <Badge>{error}</Badge>}
    </Container>
  );
};

export { Input };

const Container = styled.div`
  position: relative;
`;

const InputStyled = styled.input<{ error?: boolean }>`
  padding: 11px 15px;
  box-sizing: border-box;
  width: 100%;
  border: 1px solid ${ifProp('error', colors.red, colors.strokeGray)};
  border-radius: 5px;
  color: ${colors.textMain};
  font-size: 13px;

  &::placeholder {
    color: ${colors.textWeak};
  }
`;

const Badge = styled.div`
  position: absolute;
  bottom: -22px;

  min-width: 62px;
  text-align: center;
  padding: 4px 6px;
  margin-right: 8px;

  font-size: 10px;
  font-style: italic;
  font-weight: 900;
  text-transform: uppercase;

  color: #fff;
  background-color: ${colors.red};
  border-radius: 4px;
`;
