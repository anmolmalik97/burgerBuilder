import React,{Component} from 'react';
import {connect} from 'react-redux';
import Aux from '../Aux/Aux'
import classes from './Layout.css'
import ToolBar from '../../components/Navigation/ToolBar/ToolBar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'
class Layout extends Component {
	state = {
		showSideDrawer: false
	}
	SideDrawerClosedhandler = () =>{
		this.setState({
			showSideDrawer: false
		});
	}
	SideDrawerTogglehandler = () =>{
		this.setState((prevState) => {
			return {showSideDrawer: !prevState.showSideDrawer}
		});
	}
	render(){
		return (
		<Aux>
			<ToolBar isAuth = {this.props.isAuthenticated} drawerToggleClicked = {this.SideDrawerTogglehandler}/>
			<SideDrawer isAuth = {this.props.isAuthenticated} closed = {this.SideDrawerClosedhandler} 
			open = {this.state.showSideDrawer}/>
			<main className = {classes.Content}>{this.props.children}</main>
		</Aux>
		)
	}
}

const mapStateToProps = state => {
	return {
		isAuthenticated: state.auth.token !== null
	}
}

export default connect(mapStateToProps)(Layout);