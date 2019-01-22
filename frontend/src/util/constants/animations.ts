export const pageAnimations = {
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

export const versionsTransitions = {
	from: {
		opacity: 0,
		transform: 'translateY(64px) scale(0.8)',
	},
	enter: {
		opacity: 1,
		transform: 'translateY(0px) scale(1)',
	},
	leave: {
		opacity: 0,
		transform: 'translateY(64px) scale(0.8)',
	},
}

export const modalContentAnimations = {
	from: {
		transform: 'scale(0.92) translateY(-32%)',
	},
	to: {
		transform: 'scale(1) translateY(0)',
	},
}

export const modalBackgroundAnimations = {
	from: {
		opacity: 0,
	},
	to: {
		opacity: 1,
	},
}
