import { config } from 'react-spring'

export const SERVER_URI = process.env.REACT_APP_SERVER_URL || 'http://0.0.0.0:4000/admins'
export const PUBLIC_API_URI = process.env.PUBLIC_API_URI || 'http://localhost:4000/public'
export const animationConfig = config.stiff
