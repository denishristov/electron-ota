import { config } from 'react-spring'

export const SERVER_URI = process.env.REACT_APP_SERVER_URL || 'http://0.0.0.0:4000/admins'

export const animationConfig = config.wobbly
