import React,{Component} from 'react';

import Button from '../../../components/ui/Button/Button'

import classes from './ContactData.css'

import axios from '../../../axios-orders.js'
import Spinner from '../../../components/ui/Spinner/Spinner'
import Input from '../../../components/ui/Input/Input'
import {connect} from 'react-redux'
class ContactData extends Component {
	state = {
		orderForm:{
			name: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'yourname'
				},
				value: '',
				validation: {
					required: true
				},
				valid: false,
                touched: false
			},
			street: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'street'
				},
				value: '',
				validation: {
					required: true
				},
				valid: false,
                touched: false
			},
			zipCode: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'zipCode'
				},
				value: '',
				validation: {
					required: true,
					minLength: 5,
					maxLength: 5
				},
				valid: false,
                touched: false
			},
			country: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'country'
				},
				value: '',
				validation: {
					required: true
				},
				valid: false,
                touched: false
			},
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'email',
					placeholder: 'your email'
				},
				value: '',
				validation: {
					required: true
				},
				valid: false,
                touched: false
			},
			deliveryMethod: {
				elementType: 'select',
				elementConfig: {
					options: [
					{value: 'fastest' ,displayValue: 'fastest'},
					{value: 'cheapest' ,displayValue: 'cheapest'}
					]
				},
				value: '',
                validation: {},
                valid: true
			},
		},
        formIsValid: false,
		loading: false,
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
	orderHandler = (event) => {
		event.preventDefault()
		const formData = {};
		for (let formElementIdentifier in this.state.orderForm ) {
			formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value
		}
		
		this.setState({
			loading: true
		})
		const order = {
			ingredients : this.props.ings,
			price: this.props.price,
			orderData: formData
			
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
    checkValidity(value,rules) {
        let isValid = true;
        if(!rules){
            return true
        }
        if(rules.required){
            isValid = value.trim() !== '' && isValid;
        }
        if(rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }
        if(rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }
        return isValid
    }
	inputChangeHandler = (event,inputIdentifier) => {
		const updatedOrderForm = {
			...this.state.orderForm
		};
		const updatedFormElement={...updatedOrderForm[inputIdentifier]};
		updatedFormElement.value = event.target.value;
		updatedFormElement.valid = this.checkValidity(updatedFormElement.value,updatedFormElement.validation)
		updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        let formIsValid = true;
        for(let inputIdentifier in updatedOrderForm){
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }
		this.setState({
			orderForm: updatedOrderForm,
            formIsValid: formIsValid
		});
	}
	render() {
		const formElementsArray = [];
		for (let key in this.state.orderForm){
			formElementsArray.push({
				id: key,
				config: this.state.orderForm[key]
			})
		}
		let form = (
						<form onSubmit = {this.orderHandler}>
							{formElementsArray.map(formElement => (
								<Input 
									key = {formElement.id}
									elementType = {formElement.config.elementType}
									elementConfig = {formElement.config.elementConfig}
									value = {formElement.config.value}
									changed= {(event) => this.inputChangeHandler(event,formElement.id)}
									invalid= {!formElement.config.valid}
                                    touched = {formElement.config.touched}
									shouldValidate = {formElement.config.validation}/>
															))}
							<Button btnType = 'Success' disabled = {!this.state.formIsValid}>Order!</Button>
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

const mapStateToProps = state => {
	return {
		ings: state.ingredients,
		price: state.totalPrice
	}
}

export default connect(mapStateToProps)(ContactData);