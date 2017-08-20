import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import App from './games/dice/containers/App';
import './less/main.less';

const root = document.getElementById('root');

render(
  <App/>, root
)

