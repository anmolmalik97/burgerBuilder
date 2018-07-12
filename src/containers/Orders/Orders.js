import React,{Component} from 'react';
import Order from '../../components/Order/Order'
import axios from '../../axios-orders'
import WithErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler'
class Orders extends Component {
	state = {
		orders: [],
		loading: true
	}
	componentDidMount() {
		axios.get('/orders.json')
			.then(res => {
				const fetchedOrders = [];
				for(let Key in res.data) {
					fetchedOrders.push({
						...res.data[Key],
						id:Key
					});
				}
				console.log(fetchedOrders)
				this.setState({
					loading: false,
					orders: fetchedOrders
				})
			})
			.catch(error => {
				this.setState({loading: false})
			})
	}
	render() {
		return (
			<div>
			 {this.state.orders.map(order => (
			 	<Order 
			 		key = {order.id}
			 		ingredients = {order.ingredients}
			 		price = {+order.price}/>))}
			</div>
		)
	}
}

export default WithErrorHandler(Orders,axios)