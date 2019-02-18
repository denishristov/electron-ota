import chalk from 'chalk'
// tslint:disable:max-line-length
export const shadow = '0 5px 12px rgba(67, 106, 185, .22), 0 1px 4px rgba(67, 106, 185, .13), 0 -5px 15px -1px rgba(67, 106, 185, .01), inset 0 0 20px -3px rgba(67, 106, 185, .025)'

export const activeShadow = '0 5px 12px rgba(67, 106, 185, .12), 0 1px 4px rgba(67, 106, 185, .03), 0 -5px 15px -1px rgba(67, 106, 185, .01), inset 0 0 20px -3px rgba(67, 106, 185, .025)'

export const green = '#54f18e'

export const accent = '#dedede'

export const terminalColors = {
	request: chalk.bold.green,
	response: chalk.bold.blue,
	error: chalk.bold.red,
	eventType: chalk.bold.yellow,
	update: chalk.bold.magenta,
}
