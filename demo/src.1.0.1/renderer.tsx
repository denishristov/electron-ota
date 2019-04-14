import { useState, createElement } from 'react'
import ReactDOM from 'react-dom'

function CounterWithName() {
	const [ count, setCount ] = useState(0)
	const [ name, setName ] = useState('Flavio')

	function handleCounterButtonClick() {
		setCount(count + 1)
	}

	function handleChangeNameClick() {
		setName(name === 'Flavio' ? 'Roger' : 'Flavio')
	}

	return (
		<div>
			<p>Version: {require('../package.json').version}</p>
			<p>Hi {name} you clicked {count} times</p>
			<button onClick={handleCounterButtonClick}>
				Click me
			</button>
			<button onClick={handleChangeNameClick}>
				Change name
			</button>
		</div>
	)
}

ReactDOM.render(<CounterWithName />, document.getElementById('root'))
