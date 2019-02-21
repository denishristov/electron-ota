import { useState, createElement } from 'react'
import ReactDOM from 'react-dom'

function Counter() {
	const [ count, setCount ] = useState(0)

	function handleClick() {
		setCount(count + 1)
	}

	return (
		<div>
			<p>You clicked {count} times</p>
			<button onClick={handleClick}>Click me</button>
		</div>
	)
}

ReactDOM.render(<Counter />, document.getElementById('root'))
