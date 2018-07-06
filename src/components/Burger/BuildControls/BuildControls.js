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
			{Controls.map((ctrl) => {
				return <BuildControl label ={ctrl.label} key = {ctrl.label} />
			})}
		</div>
	)

export default BuildControls;