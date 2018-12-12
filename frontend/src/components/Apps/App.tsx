import React, { Component } from 'react'

interface IProps {
	app: any
	// emitUpdateApp: Function
	// emitDeleteApp: Function
}

class App extends Component<IProps> {
	render() {
		const {
			app,
			// emitUpdateApp,
			// emitDeleteApp
		} = this.props

		const {
			name,
			isCritical
		} = app

		return (
			<div>
				<h1>{name}</h1>
				<h2>{`is critical: ${isCritical}`}</h2>
				<button>
					Delete
				</button>
			</div>
		)
	}
}

export default App;