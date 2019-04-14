import { config } from 'react-spring'

if (!process.env.REACT_APP_SERVER_URI) {
	throw new Error('REACT_APP_SERVER_URI is missing')
}

if (!process.env.REACT_APP_PUBLIC_API_URI) {
	throw new Error('REACT_APP_PUBLIC_API_URI is missing')
}

export const SERVER_URI = process.env.REACT_APP_SERVER_URI
export const PUBLIC_API_URI = process.env.REACT_APP_PUBLIC_API_URI

export const animationConfig = config.default
