import { config } from 'react-spring'

// tslint:disable-next-line:max-line-length
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

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

type ClassName = string | boolean | void | null | number

export function list(...classNames: ClassName[]) {
	return classNames.filter(Boolean).join(' ')
}

interface IEvent {
	stopPropagation: () => void
}

export function stopPropagation(event: IEvent) {
	event.stopPropagation()
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
	const thresh = 1024

	if (Math.abs(bytes) < thresh) {
			return bytes + ' B'
	}

	const units = ['kB','MB','GB','TB','PB','EB','ZB','YB']

	let i = -1
	for ( ; Math.abs(bytes) >= thresh && i < units.length - 1; ++i) {
		bytes /= thresh
	}

	return bytes.toFixed(1) + ' ' + units[i]
}
