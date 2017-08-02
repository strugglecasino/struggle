import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './stores/';
import App from './components/App';
import config from './utils/config';
import './less/main.less';


const store = configureStore;
const root = document.getElementById('root');

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  root
)