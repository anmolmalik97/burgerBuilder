import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://react-burgerbuilder-e69af.firebaseio.com/'
})

export default instance;