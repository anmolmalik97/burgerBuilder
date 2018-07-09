import React,{Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/ui/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/ui/Spinner/Spinner'
import WithErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler'

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 1,
	meat: 2,
	bacon: 0.8,
}

class BurgerBuilder extends Component{
	state = {
		ingredients: null,
		totalPrice: 4,
		purchaseable: false,
		purchasing: false,
		loading: false,
		error: false
	}
	componentDidMount() {
		axios.get('https://react-burgerbuilder-e69af.firebaseio.com/ingredients.json')
			.then(response => {
				this.setState({
					ingredients: response.data
				})
			})
			.catch(error => {
				this.setState({
					error: true
				})
			})
	}
	updatePurchaseState(ingredients){
		const sum = Object.keys(ingredients)
		.map((igKey) => {
			return ingredients[igKey]
		})
		.reduce((sum,el) =>{
			return sum + el
		},0)
		this.setState({purchaseable: sum > 0});
	}
	addIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		const updatedCount = oldCount + 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCount;
		const oldPrice = this.state.totalPrice;
		const updatedPrice = oldPrice + INGREDIENT_PRICES[type];
		this.setState({
			ingredients: updatedIngredients,
			totalPrice: updatedPrice,
		})
		this.updatePurchaseState(updatedIngredients);
		
	}
	removeIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		if (oldCount <= 0 ){
			return;
		}
		const updatedCount = oldCount - 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCount;
		const oldPrice = this.state.totalPrice;
		const updatedPrice = oldPrice - INGREDIENT_PRICES[type];
		this.setState({
			ingredients: updatedIngredients,
			totalPrice: updatedPrice,
		})
		this.updatePurchaseState(updatedIngredients);

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
		this.setState({
			loading: true
		})
		const order = {
			ingredients : this.state.ingredients,
			price: this.state.totalPrice,
			customer: {
				name: 'anmol malik',
				address: {
					street: 'test1',
					zipCode: '123',
					country: 'india'
				},
				email: 'abc@gmail.com',

			},
			deliveryMethod: 'fastest'
		}
		axios.post('/orders.json',order)
			.then(response => {
				this.setState({loading: false,
							   purchasing: false})
				console.log(response);
			})
			.catch(error => {
				this.setState({loading: false,
							   purchasing: false})
			})
	}
	render(){
		const disabledInfo = {
			...this.state.ingredients
		}
		for (let key in disabledInfo){
			disabledInfo[key] = disabledInfo[key] <= 0
		}
		let orderSummary = null;
		if(this.state.loading){
			orderSummary = <Spinner/>
		}
		let burger = this.state.error ? <p>ingredients cant be loaded</p> :<Spinner/>
		if(this.state.ingredients){
			burger = (
				<Aux>
					<Burger ingredients = {this.state.ingredients}/>
					  <BuildControls 
							ingredientAdded = {this.addIngredientHandler}
							ingredientRemoved = {this.removeIngredientHandler}
							disabled = {disabledInfo}
							price = {this.state.totalPrice}
							purchaseable = {this.state.purchaseable}
							ordered = {this.purchaseHandler}/>
				</Aux>
			);
			orderSummary = <OrderSummary 
					ingredients = {this.state.ingredients} 
					purchaseCancelled = {this.purchaseCancelHandler}
					purchaseContinued = {this.purchaseContinueHandler}
					price = {this.state.totalPrice}/>;
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

export default WithErrorHandler(BurgerBuilder,axios);