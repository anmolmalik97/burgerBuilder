import React,{Component} from 'react';

import Button from '../../../components/ui/Button/Button'

import classes from './ContactData.css'

import axios from '../../../axios-orders.js'
import Spinner from '../../../components/ui/Spinner/Spinner'
class ContactData extends Component {
	state = {
		name: '',
		email: '',
		address: {
			street: '',
			postalCode: '',
		},
		loading: false
	}
	orderHandler = (event) => {
		event.preventDefault()
		
		this.setState({
			loading: true
		})
		const order = {
			ingredients : this.props.ingredients,
			price: this.props.price,
			customer: {
				name: 'anmol malik',
				address: {
					street: 'test1',
					zipCode: '123',
					country: 'india'
				},
				email: 'abcd@gmail.com',

			},
			deliveryMethod: 'fastest'
		}
		axios.post('/orders.json',order)
			.then(response => {
				this.setState({loading: false})
				console.log(response);
				this.props.history.push('/')
			})
			.catch(error => {
				this.setState({loading: false})
			})

	}
	render() {
		let form = (
						<form action="">
							<input className = {classes.Input} type="text" name = "name" placeholder = "your Name"/>
							<input className = {classes.Input} type="email" name = "email" placeholder = "your Mail"/>
							<input className = {classes.Input} type="text" name = "street" placeholder = "street"/>
							<input className = {classes.Input} type="text" name = "postalCode" placeholder = "postalCode"/>
							<Button btnType = 'Success' clicked = {this.orderHandler}>Order!</Button>
						</form>
					)
		if(this.state.loading){
			form = <Spinner/>
		}
		return(
			<div className = {classes.Contactdata}>
				<h4>Enter your contact data</h4>
				{form}
			</div>
		);
	}
}

export default ContactData;