import React from 'react';
import classes from './BuildControls.css'
import BuildControl from './BuildControl/BuildControl'

const Controls = [
	{label: 'Salad',type: 'salad'},
	{label: 'Bacon',type: 'bacon'},
	{label: 'Cheese',type: 'cheese'},
	{label: 'Meat',type: 'meat'},
]

const BuildControls = (props) => (
		<div className = {classes.BuildControls}>
			<p>Current price: <strong>{props.price.toFixed(2)}</strong></p>
				{Controls.map((ctrl) => {
					return <BuildControl 
								label ={ctrl.label}
								key = {ctrl.label}
								added = {props.ingredientAdded.bind(this,ctrl.type)}
								removed = {props.ingredientRemoved.bind(this,ctrl.type)}
								disabled = {props.disabled[ctrl.type]}/>
				})}
			<button className = {classes.OrderButton} 
					disabled = {!props.purchaseable} 
					onClick = {props.ordered}>{props.isAuth? 'ORDER NOW!' : 'Signup to order'}</button>
		</div>
	)

export default BuildControls;