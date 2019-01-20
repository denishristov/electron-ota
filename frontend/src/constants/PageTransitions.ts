const pageTransitions = {
	PUSH: {
		from: {
			opacity: 0,
			transform: 'translateY(32px) scale(0.98)',
		},
		enter: {
			opacity: 1,
			transform: 'translateY(0px) scale(1)',
		},
		leave: {
			opacity: 0,
			transform: 'translateY(-32px) scale(1.02)',
		},
	},
	POP: {
		from: {
			opacity: 0,
			transform: 'translateY(-32px) scale(1.02)',
		},
		enter: {
			opacity: 1,
			transform: 'translateY(0px) scale(1)',
		},
		leave: {
			opacity: 0,
			transform: 'translateY(32px) scale(0.98)',
		},
	},
}

export default pageTransitions
