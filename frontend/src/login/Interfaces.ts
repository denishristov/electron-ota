import UserStore from '../stores/UserStore'

export interface ILoginProps {
	userStore: UserStore
}

export interface ILoginFormElements extends HTMLFormControlsCollection {
	email: HTMLInputElement
	password: HTMLInputElement
}