import { config } from 'react-spring'
import { ClassName, IEvent } from './types'
import { emailRegex } from '../constants/regex'

export function isEmail(candidate: string): boolean {
	return emailRegex.test(candidate)
}

export function copyToClipboard(text: string) {
	const node = document.createElement('textarea')
	node.value = text

	document.body.appendChild(node)
	node.select()

	document.execCommand('copy')
	document.body.removeChild(node)
}

export function downloadFile(uri: string) {
	const link = document.createElement('a')

	link.download = name
	link.href = uri
	link.click()
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

export function hashBlob(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()

		reader.readAsArrayBuffer(blob)

		reader.addEventListener('load', handleLoad)
		reader.addEventListener('error', reject)

		async function handleLoad() {
			const buffer = await crypto.subtle.digest('SHA-256', reader.result as ArrayBuffer)
			const hash = btoa(String.fromCharCode(...new Uint8Array(buffer)))

			reader.removeEventListener('load', handleLoad)

			resolve(hash)
		}
	})
}

export function getConfig(name: string) {
	return config.gentle
}

export function formatFileSize(bytes: number) {
	const units = ['KB','MB','GB','TB','PB','EB','ZB','YB']
	const thresh = 1024

	if (Math.abs(bytes) < thresh) {
		return bytes + ' B'
	}

	let i = -1
	for ( ; Math.abs(bytes) >= thresh && i < units.length - 1; ++i) {
		bytes /= thresh
	}

	return bytes.toFixed(1) + ' ' + units[i]
}
