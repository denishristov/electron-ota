import { config } from 'react-spring'
import { ClassName, IEvent, IEntry, ITimestampedDocument } from './types'
import { emailRegex } from './constants/regex'
import { RouteProps } from 'react-router'
import { SimpleVersionReportModel } from '../../../shared/src/schemas/Reports'

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

export function downloadFile(uri: string, name: string) {
	const element = document.createElement('a')
	element.setAttribute('href', uri)
	element.setAttribute('download', name)

	element.style.display = 'none'
	document.body.appendChild(element)

	element.click()

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

export function getSourceFromFile(file: File): Promise<string | null> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)

		function handleLoad() {
			reader.removeEventListener('load', handleLoad)

			if (reader.result) {
				resolve(reader.result as string)
			}

			resolve(null)
		}

		reader.addEventListener('load', handleLoad)
		reader.addEventListener('error', reject)
	})
}

export function hashFile(file: File): Promise<string | null> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()

		reader.readAsArrayBuffer(file)

		reader.addEventListener('load', handleLoad)
		reader.addEventListener('error', reject)

		async function handleLoad() {
			if (reader.result) {
				const buffer = await crypto.subtle.digest('SHA-256', reader.result as ArrayBuffer)
				const hash = btoa(String.fromCharCode(...new Uint8Array(buffer)))

				reader.removeEventListener('load', handleLoad)
				resolve(hash)
			} else {
				resolve(null)
			}
		}
	})
}

export function formatFileSize(bytes: number) {
	const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
	const thresh = 1024

	let i = 0
	for ( ; bytes >= thresh && i < units.length - 1; ++i) {
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
export function noop() {}

export function getPathName(location: RouteProps['location']) {
	return location ? location.pathname : 'key'
}

export function isError(data: any) {
	return Boolean(data) && (data.details || data.stack)
}

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