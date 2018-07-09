import React,{Component} from 'react';
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
			<ToolBar drawerToggleClicked = {this.SideDrawerTogglehandler}/>
			<SideDrawer closed = {this.SideDrawerClosedhandler} 
			open = {this.state.showSideDrawer}/>
			<main className = {classes.Content}>{this.props.children}</main>
		</Aux>
		)
	}
}

export default Layout;