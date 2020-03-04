import React from 'react';
import styled from 'styled-components';
import { colors } from 'lib/theme';

export const Card: React.FC = props => {
  return <Wrapper {...props}>{props.children}</Wrapper>;
};

const Wrapper = styled.div`
  box-shadow: 0 1px 1px rgba(140, 175, 217, 0.3);
  border-radius: 5px;
  background: ${colors.white};
`;
