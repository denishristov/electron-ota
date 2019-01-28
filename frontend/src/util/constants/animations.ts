export const pageAnimations = {
	PUSH: {
		from: {
			opacity: 0,
			transform: 'translateY(64px) ',
		},
		enter: {
			opacity: 1,
			transform: 'translateY(0px) ',
		},
		leave: {
			opacity: 0,
			transform: 'translateY(-64px) ',
			pointerEvents: 'none',
		},
	},
	POP: {
		from: {
			opacity: 0,
			transform: 'translateY(-64px) ',
		},
		enter: {
			opacity: 1,
			transform: 'translateY(0px)',
		},
		leave: {
			opacity: 0,
			transform: 'translateY(64px)',
			pointerEvents: 'none',
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
		pointerEvents: 'none',
	},
}

export const modalContentAnimations: { from: React.CSSProperties, to: React.CSSProperties } = {
	from: {
		transform: 'scale(0.92) translateY(-32%)',
		pointerEvents: 'none',
	},
	to: {
		transform: 'scale(1) translateY(0)',
		pointerEvents: 'all',
	},
}

export const modalBackgroundAnimations: { from: React.CSSProperties, to: React.CSSProperties } = {
	from: {
		opacity: 0,
		pointerEvents: 'none',
	},
	to: {
		opacity: 1,
		pointerEvents: 'all',
	},
}
