import UserStore from '../stores/UserStore'
import { FormEvent } from 'react';

interface ILoginFormEventTargetElements {
	email: HTMLInputElement
	password: HTMLInputElement
}

interface ILoginFormEventTarget extends EventTarget {
	elements: ILoginFormEventTargetElements
}

export interface ILoginFormElement extends FormEvent<HTMLFormElement> {
	target: ILoginFormEventTarget
}

export interface ILoginProps {
	userStore: UserStore
}