import { useState, useEffect, Fragment, createElement } from 'react'
import ReactDOM from 'react-dom'
import useForceUpdate from 'use-force-update'

function padStart(this: string, targetLength: number, padString: string) {
	// tslint:disable-next-line:no-bitwise
	targetLength = targetLength >> 0 // truncate if number, or convert non-number to 0;
	padString = String(typeof padString !== 'undefined' ? padString : ' ')
	if (this.length >= targetLength) {
		return String(this)
	} else {
		targetLength = targetLength - this.length
		if (targetLength > padString.length) {
			padString += padString.repeat(targetLength / padString.length)
			// append to original to ensure we are longer than needed
		}
		return padString.slice(0, targetLength) + String(this)
	}
}

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

function Clock() {
	const forceUpdate = useForceUpdate()

	useEffect(() => {
		const timeoutId = setTimeout(forceUpdate, 1000)
		return () => {
			clearInterval(timeoutId)
		}
	})

	const now = new Date()
	return (
		<div>
			{padStart.call(now.getHours().toString(), 2, '0')}
			:
			{padStart.call(now.getMinutes().toString(), 2, '0')}
			:
			{padStart.call(now.getSeconds().toString(), 2, '0')}
		</div>
	)
}

ReactDOM.render(
	<div>
		<CounterWithName />
		<Clock />
	</div>,
	document.getElementById('root'),
)
