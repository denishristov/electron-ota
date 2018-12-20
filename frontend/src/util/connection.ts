import io from 'socket.io-client'

const ioURL = 'http://localhost:4000/admins'

export default io(ioURL)
