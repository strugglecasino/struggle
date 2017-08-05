import * as types from './types';
import _ from 'lodash';

export const updateWager = (newWager) => ({type: types.UPDATE_WAGER, newWager});

export const updateMultiplier = (newMult) => ({type: types.UPDATE_MULTIPLIER, newMult});

export const setNextHash = (hexString) => ({ type: types.SET_NEXT_HASH, hexString});

export const minWager = (newWager) => ({type: types.UPDATE_WAGER, newWager});
