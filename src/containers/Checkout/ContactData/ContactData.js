import React,{Component} from 'react';
import Button from '../../../components/ui/Button/Button';
import classes from './ContactData.css';
import Spinner from '../../../components/ui/Spinner/Spinner';
import Input from '../../../components/ui/Input/Input';
import {connect} from 'react-redux';
import * as actions from '../../../store/actions/index';
import {updateObject,checkValidity} from '../../../shared/utility';

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
				value: 'fastest',
                validation: {},
                valid: true
			},
		},
        formIsValid: false,
	}
	orderHandler = (event) => {
		event.preventDefault()
		const formData = {};
		for (let formElementIdentifier in this.state.orderForm ) {
			formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value
		}
		
		const order = {
			ingredients : this.props.ings,
			price: this.props.price,
			orderData: formData,
			userId: this.props.userId
			
		}
		this.props.onOrderBurger(order,this.props.token)

	}

	inputChangeHandler = (event,inputIdentifier) => {
		const updatedFormElement = updateObject(this.state.orderForm[inputIdentifier],{
			value: event.target.value,
			valid: checkValidity(event.target.value,this.state.orderForm[inputIdentifier].validation),
			touched: true
		});
		const updatedOrderForm = updateObject(this.state.orderForm,{
			[inputIdentifier]: updatedFormElement
		})
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
		if(this.props.loading){
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
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		loading: state.order.loading,
		token: state.auth.token,
		userId: state.auth.userId
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onOrderBurger: (orderData,token) => dispatch(actions.purchaseBurger(orderData,token))
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(ContactData);