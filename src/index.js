import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './stores/configureStore';

import App from './components/App';
import './less/main.less';





const root = document.getElementById("root");
render(
  <Provider store={store}>
        <App/>
  </Provider>, root 
  );