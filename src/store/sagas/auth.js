import {put} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import * as actions from '../actions/index';
import axios from 'axios';

export function* logoutSaga(action) {
	yield window.localStorage.removeItem('token');
	yield window.localStorage.removeItem('expirationDate');
	yield window.localStorage.removeItem('userId');
	yield put(actions.logoutSucceed())
}

export function* checkAuthTimeoutSaga(action) {
	yield delay(action.expirationTime * 1000);
	yield put(actions.logoutSucceed())
}

export function* authUserSaga(action) {
	yield put(actions.authStart)
	const authData = {
		email: action.email,
		password: action.password,
		returnSecureToken: true
	}
	let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyC5dCdOVXbKC27EVK5Or0E1UqbGHnZqr_k';
	if(!action.isSignup)
		url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyC5dCdOVXbKC27EVK5Or0E1UqbGHnZqr_k'
	try{
		const res = yield axios.post(url,authData)
		const expirationTime =  yield new Date(new Date().getTime() + res.data.expiresIn * 1000);
		yield window.localStorage.setItem('token',res.data.idToken);
		yield window.localStorage.setItem('expirationDate',expirationTime);
		yield window.localStorage.setItem('userId',res.data.localId);
		yield put(actions.authSuccess(res.data.idToken,res.data.localId));
		yield put(actions.checkAuthTimeout(res.data.expiresIn))
	}catch(err){
		yield put(actions.authFail(err.response.data.error))
	}
}

export function* authCheckStateSaga(action) {
	const token = yield window.localStorage.getItem('token');
		if(!token){
			yield put(actions.logout());
		}else{
			const expirationDate = yield new Date(window.localStorage.getItem('expirationDate'));
			if(expirationDate <= new Date()){
				yield put(actions.logout())
			}else{
				const userId = yield window.localStorage.getItem('userId');
				yield put(actions.authSuccess(token,userId));
				yield put(actions.checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
			}
		}
}




