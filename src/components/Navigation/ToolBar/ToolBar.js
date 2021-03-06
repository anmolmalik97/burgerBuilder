import React from 'react'
import classes from './ToolBar.css'
import Logo from '../../Logo/Logo'
import NavigationItems from '../NavigationItems/NavigationItems'
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle'
const ToolBar = (props) => (
	<header className = {classes.Toolbar}>
		<DrawerToggle clicked = {props.drawerToggleClicked}/>
		<div className = {classes.Logo}>
			<Logo />
		</div>
		<nav className = {classes.DesktopOnly}>
			<NavigationItems isAuthenticated = {props.isAuth}/>
		</nav>
	</header>
)

export default ToolBar