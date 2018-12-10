import UserStore from '../../stores/UserStore'
import { FormEvent } from 'react';
import { RouterStore } from 'mobx-react-router'

interface ILoginFormEventTargetElements {
	email: HTMLInputElement
	password: HTMLInputElement
}

interface ILoginFormEventTarget extends EventTarget {
	elements: ILoginFormEventTargetElements
}

export interface ILoginFormEvent extends FormEvent<HTMLFormElement> {
	target: ILoginFormEventTarget
}

export interface ILoginProps {
	userStore: UserStore
}

export interface IHomePageProps {
	userStore: UserStore
}
