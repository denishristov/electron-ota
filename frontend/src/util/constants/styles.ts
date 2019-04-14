import chalk from 'chalk'
// tslint:disable:max-line-length
export const shadows = {
	rest: '0 5px 12px rgba(67, 106, 185, .22), 0 1px 4px rgba(67, 106, 185, .13), 0 -5px 15px -1px rgba(67, 106, 185, .01), inset 0 0 20px -3px rgba(67, 106, 185, .025)',
	active: '0 5px 12px rgba(67, 106, 185, .12), 0 1px 4px rgba(67, 106, 185, .03), 0 -5px 15px -1px rgba(67, 106, 185, .01), inset 0 0 20px -3px rgba(67, 106, 185, .025)',
}

export const colors = {
	ui: {
		accent: '#dedede',
		darkAccent: '#9a9a9a',
		text: '#29323c',
	},
	data: {
		red: '#ff9696',
		orange: '#ffc7a0',
		yellow: '#ffecd2',
		green: '#84fab0',
		blue: '#8fd3f4',
		purple: '#bbaaff',
		pink: '#ffbad7',
	},
}

export const terminalColors = {
	request: chalk.bold.green,
	response: chalk.bold.blue,
	error: chalk.bold.red,
	eventType: chalk.bold.yellow,
	update: chalk.bold.magenta,
}
