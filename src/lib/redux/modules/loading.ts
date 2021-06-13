import { createAction, ActionType, createReducer } from 'typesafe-actions';

interface State {
	loading: boolean;
	target: any;
}

const initialState = {
	loading: false,
	target: null // any action
};

export const loading = {
	start: createAction('LOADING_START', (target: string) => target)(),
	end: createAction('LOADING_END', (target: string) => target)()
};

export type LoadingActions = ActionType<typeof loading>;

export const loadingReducer = createReducer<State, LoadingActions>(initialState)
	.handleAction(loading.start, (state, action) => ({
		...state,
		loading: true,
		target: action.payload // `target` references what is being loaded
	}))
	.handleAction(loading.end, (state, action) => ({
		...state,
		loading: false,
		target: action.payload
	}));
