import { ClassName, IEvent, IEntry, ITimestampedDocument } from './types'
import { emailRegex } from './constants/regex'
import { RouteProps } from 'react-router'
import { SimpleVersionReportModel } from 'shared'

export function isEmail(candidate: string): boolean {
	return emailRegex.test(candidate)
}

export function copyToClipboard(text: string) {
	const element = document.createElement('textarea')
	element.value = text

	document.body.appendChild(element)
	element.select()

	document.execCommand('copy')
	document.body.removeChild(element)
}

export function list(...classNames: ClassName[]) {
	return classNames.filter(Boolean).join(' ')
}

export function stopPropagation(event: IEvent) {
	event.stopPropagation()
}

export function stopEvent(event: IEvent) {
	event.stopPropagation()
	event.preventDefault()
}

export function preventClose(event: BeforeUnloadEvent) {
	event.preventDefault()
	event.returnValue = ''
}

export function formatFileSize(bytes: number) {
	const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
	const thresh = 1024

	let i = 0
	for (; bytes >= thresh && i < units.length - 1; ++i) {
		bytes /= thresh
	}

	return `${bytes.toFixed(1)} ${units[i]}`
}

export function getId(entry: IEntry) {
	return entry.id
}

export function formatDate(date: Date) {
	const options = {
		year: date.getFullYear() === new Date().getFullYear() ? void 0 : 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	}

	return date.toLocaleDateString('en-US', options)
}

// tslint:disable-next-line:no-empty
export function noop() { }

export function getDefaultSimpleStatistics(version: string): SimpleVersionReportModel {
	return {
		downloadedCount: 0,
		downloadingCount: 0,
		usingCount: 0,
		errorsCount: 0,
		version,
	}
}

export function byDateDesc(a: ITimestampedDocument, b: ITimestampedDocument) {
	return +new Date(b.createdAt) - +new Date(a.createdAt)
}

export function returnArgument<T>(arg: T) {
	return arg
}

export function filterValues(object: object) {
	return Object.entries(object)
		.filter(([_, value]) => value !== null && value !== void 0 && value !== '')
		.group(returnArgument)
}

export function rangedArray(length: number) {
	const array = []

	for (let i = 0; i < length; ++i) {
		array.push(i)
	}

	return array
}

// tslint:disable no-any
export function memoize(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>) {
	if (descriptor.value != null) {
		descriptor.value = getNewFunction(descriptor.value)
	} else if (descriptor.get != null) {
		descriptor.get = getNewFunction(descriptor.get)
	} else {
		throw new Error('Only put a Memoize decorator on a method or get accessor.')
	}
}

let memoizedCounter = 0

function getNewFunction(originalFunction: () => void) {
	const identifier = ++memoizedCounter

	return function (this: any, ...args: any[]) {
		const argumentsKey = args.map((x) => typeof x === 'object' ? JSON.stringify(x) : `${x}`).join('_')

		const propName = `__memoized_${originalFunction.name}_${identifier}_${argumentsKey}`

		if (!this.hasOwnProperty(propName)) {
			Object.defineProperty(this, propName, {
				configurable: false,
				enumerable: false,
				writable: false,
				value: originalFunction.apply(this, args as any),
			})
		}

		return this[propName]
	}
}

export function getColor(d: { gradientLabel: string }) {
	return `url(#${d.gradientLabel})`
}

export function isDifferenceLongerThanHour(a: Date, b: Date) {
	return Math.abs(+a - +b) > (1000 * 60 * 60)
}

export function naturalNumber(num: number) {
	return (num % 1 === 0 && num >= 0) ? num : void 0
}

export function randomInteger(min: number, max: number) {
	return Math.floor(Math.random() * (max - min)) + min
}

export function capitalize(str: string) {
	return [str[0].toLocaleUpperCase(), ...str.slice(1)].join('')
}

export function gradient(color: string) {
	return { backgroundImage: `linear-gradient(225deg, ${color} -40%, rgba(255,255,255,0) 140%)` }
}
