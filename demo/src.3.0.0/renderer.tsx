import { useState, createElement, useEffect } from 'react'
import ReactDOM from 'react-dom'

function CounterWithName() {
	const [count, setCount] = useState(0)
	const [name, setName] = useState('Flavio')

	function handleCounterButtonClick() {
		setCount(count + 1)
	}

	function handleChangeNameClick() {
		setName(name === 'Flavio' ? 'Roger' : 'Flavio')
	}

	useEffect(() => {
		const root = document.getElementById('root')
		root.style.backgroundImage = 'linear-gradient(-225deg, #2CD8D550 0%, #C5C1FF50 56%, #FFBAC350 100%)'
	}, [])

	return (
		<div>
			<p>Version: {require('../package.json').version}</p>
			<p>Hi {name} you clicked {count} times</p>
			<div className='row'>
				<button onClick={handleCounterButtonClick}>
					Click me
				</button>
				<button onClick={handleChangeNameClick}>
					Change name
				</button>
			</div>
		</div>
	)
}

ReactDOM.render(<CounterWithName />, document.getElementById('root'))
