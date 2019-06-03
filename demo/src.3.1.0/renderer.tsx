import { useState, useEffect, createElement } from 'react'
import ReactDOM from 'react-dom'
import useForceUpdate from 'use-force-update'

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

function Clock() {
	const forceUpdate = useForceUpdate()

	useEffect(() => {
		const timeoutId = setInterval(forceUpdate, 1000)

		return () => clearInterval(timeoutId)
	}, [])

	const now = new Date()

	return (
		<h1>
			{now.getHours()}:{now.getMinutes()}:{now.getMinutes()}
		</h1>
	)
}

ReactDOM.render(
	<div>
		<CounterWithName />
		<Clock />
	</div>,
	document.getElementById('root'),
)
