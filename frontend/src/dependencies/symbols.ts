// tslint:disable:variable-name
export const Api = Symbol.for('Api')

export const Connection = Symbol.for('Connection')

export const Stores = {
	Apps: Symbol.for('Store.Apps'),
	Root: Symbol.for('Store.Root'),
	Admin: Symbol.for('Store.Admin'),
	Register: Symbol.for('Register.Admin'),
}

export const Factories = {
	App: Symbol.for('App.Factory'),
}

export const BrowserHistory = Symbol.for('BrowserHistory')
