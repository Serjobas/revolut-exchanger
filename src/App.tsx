import React from 'react';
import { Provider } from 'react-redux';
import { Exchanger } from 'features/exchanger';
import store from 'features/store';
import GlobalStyle from './global-style';

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Provider store={store}>
        <Exchanger />
      </Provider>
    </>
  );
};

export default App;
