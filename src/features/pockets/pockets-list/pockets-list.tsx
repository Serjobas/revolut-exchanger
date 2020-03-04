import React from 'react';
import styled, { css } from 'styled-components';
import { ifProp } from 'styled-tools';
import { colors } from 'lib/theme';
import { formatCurrency } from 'lib/currency';

import { PocketsType } from '../types';

interface PocketsListProps {
  pockets: PocketsType;
  activePocket: string;
  disabledPocket?: string;
  onClick: (value: string) => void;
}

export const PocketsList: React.FC<PocketsListProps> = ({
  pockets,
  activePocket,
  disabledPocket,
  onClick,
}) => {
  return (
    <PocketsContainer>
      {Object.keys(pockets).map(pocketKey => (
        <Pocket
          key={pocketKey}
          active={pocketKey === activePocket}
          disabled={[activePocket, disabledPocket].includes(pocketKey)}
          onClick={() => onClick(pocketKey)}
        >
          {pocketKey}
          {formatCurrency(pockets[pocketKey as keyof PocketsType], pocketKey)}
        </Pocket>
      ))}
    </PocketsContainer>
  );
};

const PocketsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Pocket = styled.button<{ active?: boolean }>`
  flex: 1;
  padding: 10px 0;
  font-size: 14px;
  border-radius: 5px;
  text-align: center;

  transition: all 0.15s ease-in-out;

  & + & {
    margin-left: 10px;
  }

  &:disabled {
    opacity: 0.6;
  }

  ${ifProp(
    'active',
    css`
      color: ${colors.blue};
      border: 1px solid ${colors.blue};
      &:disabled {
        opacity: 1;
      }
    `,
    css`
      border: 1px solid ${colors.strokeGray};

      &:hover:enabled {
        cursor: pointer;
        opacity: 0.8;
        box-shadow: 0 10px 30px rgba(184, 193, 204, 0.4);
      }

      &:active:enabled {
        opacity: 0.9;
      }
    `,
  )}
`;
