import { combineReducers } from 'redux';
import { fork } from 'redux-saga/effects';

import { HYDRATE } from 'next-redux-wrapper';
import { loadingReducer } from './loading';
import themeSaga, { themeReducer } from './theme';

export const combinedReducer = combineReducers({
	loading: loadingReducer,
	theme: themeReducer
});

export const rootReducer = (state: any, action: any) => {
	if (action.type === HYDRATE) {
		const nextState = {
			...state, // use previous state
			...action.payload // apply delta from hydration
		};
		if (state.user) nextState.user = state.user; // preserve `user` on client side navigation
		if (state.theme) nextState.theme = state.theme;
		return nextState;
	}
	return combinedReducer(state, action);
};

export default function* rootSaga() {
	yield fork(themeSaga);
	// yield fork(ANOTHER_REDUCER)
}

export type RootState = ReturnType<typeof rootReducer>;
