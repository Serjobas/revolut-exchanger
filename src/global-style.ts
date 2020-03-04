import { createGlobalStyle } from 'styled-components';
import { colors } from 'lib/theme';

export default createGlobalStyle`
  body, html {
    height: 100%;
  }

  body {
    margin: 0;
    background-color: ${colors.backgroundGray};
    color: ${colors.textMain};
    font-weight: 500;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ul, li {
    margin: 0;
    padding: 0;
  }

  input, button {
    appearance: none;
    background: none;
    outline: none;
    border: none;
    color: ${colors.textMain};
    font-weight: 500;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
  }

  button {
    outline: none;
  }
`;
