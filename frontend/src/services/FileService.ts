export interface IFileService {
	getSourceFromFile(file: File): Promise<string | null>
	hashFile(file: File): Promise<string | null>
	downloadFile(uri: string, name: string): void
}

@injectable()
export default class FileService implements IFileService {
	public getSourceFromFile(file: File): Promise<string | null> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)

			function handleLoad() {
				reader.removeEventListener('load', handleLoad)

				if (reader.result) {
					resolve(reader.result as string)
				} else {
					resolve(null)
				}

			}

			reader.addEventListener('load', handleLoad)
			reader.addEventListener('error', reject)
		})
	}

	public hashFile(file: File): Promise<string | null> {
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

	public downloadFile(uri: string, name: string) {
		const element = document.createElement('a')

		element.setAttribute('href', uri)
		element.setAttribute('download', name)

		element.style.display = 'none'
		document.body.appendChild(element)

		element.click()

		document.body.removeChild(element)
	}
}
