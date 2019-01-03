import React from 'react'

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string
}

function Input({ label, ...props }: IProps) {
	return (
		<>
			<label>{label}</label>
			<div className='input-container'>
				<input {...props} />
				<div className='input-bar' />
			</div>
		</>
	)
}

export default Input
