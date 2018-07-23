import {put} from 'redux-saga/effects';
import axios from '../../axios-orders.js'
import * as actions from '../actions/index';

export function* initIngredientsSaga(action) {
	try {
		const response = yield axios.get('https://react-burgerbuilder-e69af.firebaseio.com/ingredients.json')
		yield put(actions.setIngredients(response.data))
	}catch(error){
		yield put(actions.fetchIngredientsFailed())
	}
}