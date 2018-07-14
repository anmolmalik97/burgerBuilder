import React,{Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/ui/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/ui/Spinner/Spinner';
import WithErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';


class BurgerBuilder extends Component{
	state = {
		purchasing: false,
		loading: false,
		error: false
	}
	componentDidMount() {
	// 	axios.get('https://react-burgerbuilder-e69af.firebaseio.com/ingredients.json')
	// 		.then(response => {
	// 			this.setState({
	// 				ingredients: response.data
	// 			})
	// 		})
	// 		.catch(error => {
	// 			this.setState({
	// 				error: true
	// 			})
	// 		})
	}
	updatePurchaseState(ingredients){
		const sum = Object.keys(ingredients)
		.map((igKey) => {
			return ingredients[igKey]
		})
		.reduce((sum,el) =>{
			return sum + el
		},0)
		return sum > 0;
	}
	

	purchaseHandler = ()=> {
		this.setState({
			purchasing: true
		})
	}
	purchaseCancelHandler = ()=> {
		this.setState({
			purchasing: false
		})
	}
	purchaseContinueHandler = () => {
		this.props.history.push('/checkout')
	}

	render(){
		const disabledInfo = {
			...this.props.ings
		}
		for (let key in disabledInfo){
			disabledInfo[key] = disabledInfo[key] <= 0
		}
		let orderSummary = null;
		if(this.state.loading){
			orderSummary = <Spinner/>
		}
		let burger = this.state.error ? <p>ingredients cant be loaded</p> :<Spinner/>
		if(this.props.ings){
			burger = (
				<Aux>
					<Burger ingredients = {this.props.ings}/>
					  <BuildControls 
							ingredientAdded = {this.props.onIngredientAdded}
							ingredientRemoved = {this.props.onIngredientRemoved}
							disabled = {disabledInfo}
							price = {this.props.price}
							purchaseable = {this.updatePurchaseState(this.props.ings)}
							ordered = {this.purchaseHandler}/>
				</Aux>
			);
			orderSummary = <OrderSummary 
					ingredients = {this.props.ings} 
					purchaseCancelled = {this.purchaseCancelHandler}
					purchaseContinued = {this.purchaseContinueHandler}
					price = {this.props.price}/>;
		}
		
		return (
			<Aux>
				<Modal show = {this.state.purchasing} modalClosed= {this.purchaseCancelHandler}>
					{orderSummary}
				</Modal>
				{burger}
			</Aux>);
	}
}

const mapStateToProps = state => {

	return {
		ings: state.ingredients,
		price: state.totalPrice
	}
};

const mapDispatchToProps = dispatch => {
	return {
		onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENTS,ingredientName:ingName}),
		onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENTS,ingredientName:ingName})
	}

}


export default connect(mapStateToProps,mapDispatchToProps)(WithErrorHandler(BurgerBuilder,axios));