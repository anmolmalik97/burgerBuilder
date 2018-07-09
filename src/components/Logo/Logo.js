import React from 'react'
import burgerlogo from '../../assets/Images/burger-logo.png'
import classes from './Logo.css'

const Logo = (props) => (
	<div className = {classes.Logo}>
		<img src={burgerlogo} alt = "anmol"/>
	</div>
);

export default Logo;