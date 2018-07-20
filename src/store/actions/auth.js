import * as actionTypes from './actionTypes.js';
import axios from 'axios';

export const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	};
};


export const authSuccess = (token,userId) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		idToken: token,
		userId: userId
	};
};

export const authFail = (error) => {
	return {
		type: actionTypes.AUTH_FAIL,
		error: error
	};
};

export const logout =  () => {
	window.localStorage.removeItem('token');
	window.localStorage.removeItem('expirationDate');
	window.localStorage.removeItem('userId');
	return {
		type: actionTypes.AUTH_LOGOUT
	}
}

export const checkAuthTimeout = (expirationTime) => {
	return dispatch => {
		setTimeout(() => {
			dispatch(logout())
		},expirationTime * 1000)
	}
}

export const auth = (email,password,isSignup) => {
	return dispatch => {
		dispatch(authStart());
		const authData = {
			email: email,
			password: password,
			returnSecureToken: true
		}
		let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyC5dCdOVXbKC27EVK5Or0E1UqbGHnZqr_k';
		if(!isSignup)
			url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyC5dCdOVXbKC27EVK5Or0E1UqbGHnZqr_k'
		axios.post(url,authData)
			.then(res => {
				console.log(res);
				const expirationTime =  new Date(new Date().getTime() + res.data.expiresIn * 1000);
				window.localStorage.setItem('token',res.data.idToken);
				window.localStorage.setItem('expirationDate',expirationTime);
				window.localStorage.setItem('userId',res.data.localId);
				dispatch(authSuccess(res.data.idToken,res.data.localId));
				dispatch(checkAuthTimeout(res.data.expiresIn))
			})
			.catch(err => dispatch(authFail(err.response.data.error)))
	}
}

export const setAuthRedirectPath = (path) => {
	return {
		type: actionTypes.SET_AUTH_REDIRECT_PATH,
		path: path
	}
}


export const authCheckState = () => {
	return dispatch => {
		const token = window.localStorage.getItem('token');
		if(!token){
			dispatch(logout());
		}else{
			const expirationDate = new Date(window.localStorage.getItem('expirationDate'));
			if(expirationDate <= new Date()){
				dispatch(logout())
			}else{
				const userId = window.localStorage.getItem('userId');
				dispatch(authSuccess(token,userId));
				dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
			}

		}
	}
}