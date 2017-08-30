import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import Dice from '../src/games/dice/containers/';
import './less/main.less';

const root = document.getElementById('root');

render(
  <Dice/>, root
)

