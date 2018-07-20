import React,{Component} from 'react';
import Order from '../../components/Order/Order'; 
import axios from '../../axios-orders';              
import WithErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import * as actions from '../../store/actions/index';
import {connect} from 'react-redux';
import Spinner from '../../components/ui/Spinner/Spinner'
class Orders extends Component {
	componentDidMount() {
		this.props.onFetchOrders(this.props.token,this.props.userId)
	}
	render() {
		let orders = <Spinner/>;
		if(!this.props.loading){
			orders = (<div>
			 {this.props.orders.map(order => (
			 	<Order 
			 		key = {order.id}
			 		ingredients = {order.ingredients}
			 		price = {+order.price}/>))}
			</div>)
		}
		return orders
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onFetchOrders : (token,userId) => dispatch(actions.fetchOrders(token,userId))
	}
}

const mapStateToProps = state => {
	return {
		orders: state.order.orders,
		loading: state.order.loading,
		token: state.auth.token,
		userId: state.auth.userId
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(WithErrorHandler(Orders,axios))