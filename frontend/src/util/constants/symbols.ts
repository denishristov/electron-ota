// tslint:disable:variable-name
export const Connection = Symbol.for('Connection')

export const Stores = {
	Apps: Symbol.for('Store.Apps'),
	Root: Symbol.for('Store.Root'),
	User: Symbol.for('Store.Admin'),
	Register: Symbol.for('Register.Admin'),
}

export const Factories = {
	App: Symbol.for('App.Factory'),
	CreateVersionStore: Symbol.for('CreateVersionStore.Factory'),
	UpdateVersionStore: Symbol.for('UpdateVersionStore.Factory'),
}

export const Services = {
	Api: Symbol.for('Services.Api'),
	File: Symbol.for('Services.File'),
	Upload: Symbol.for('Services.Upload'),
}

export const BrowserHistory = Symbol.for('BrowserHistory')
