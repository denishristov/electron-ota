import ElectronClientUpdateService from './service'
import { parseConfigFile } from './functions'

const config = parseConfigFile()
const ElectronOTA = config ? new ElectronClientUpdateService(config) : null

export { ElectronClientUpdateService }
export default ElectronOTA
