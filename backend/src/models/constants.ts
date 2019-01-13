import { mongooseRef } from '../util/util'

export const ADMIN = 'Admin'
export const CLIENT = 'Client'
export const APP = 'App'
export const VERSION = 'Version'
export const VERSION_STATISTICS = 'ReleaseStatistics'
export const RELEASE = 'Release'

export const ADMIN_REF = mongooseRef(ADMIN)
export const CLIENT_REF = mongooseRef(CLIENT)
export const APP_REF = mongooseRef(APP)
export const VERSION_REF = mongooseRef(VERSION)
export const VERSION_STATISTICS_REF = mongooseRef(VERSION_STATISTICS)
export const RELEASE_REF = mongooseRef(RELEASE)
