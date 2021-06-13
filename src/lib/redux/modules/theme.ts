import { createAction, createReducer, ActionType } from 'typesafe-actions';
import { takeLatest, put, StrictEffect } from 'redux-saga/effects';
import { loading } from './loading';
// import { SimpleEffect } from 'redux-saga'

export enum Theme {
	light = 'light',
	dark = 'dark'
}

interface State {
	theme: Theme;
}

const initialState: State = {
	theme: Theme.light
};

export const setTheme = createAction('SET_THEME', (target: Theme) => target)();

export type ThemeActions = ActionType<typeof setTheme>;

// THEME SAGA
export default function* themeSaga(): Generator<StrictEffect, any, boolean> {
	const TARGET = 'TOGGLE_THEME';
	yield put(loading.start(TARGET)); // show loader

	try {
		yield takeLatest(setTheme, themeSaga);
	} catch (err) {
		console.log(err);
	}

	yield put(loading.end(TARGET)); // show loader
}

export const themeReducer = createReducer<State, ThemeActions>(
	initialState
).handleAction(setTheme, (state, action) => ({
	...state,
	theme: action.payload
}));
