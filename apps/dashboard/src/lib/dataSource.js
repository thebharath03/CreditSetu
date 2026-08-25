import * as mockDataSource from './mockDataSource'
import * as liveDataSource from './liveDataSource'

export const useMock = import.meta.env.VITE_USE_MOCK !== 'false'
const impl = useMock ? mockDataSource : liveDataSource

export const listApplicants = impl.listApplicants
export const getApplicant = impl.getApplicant
export const issueCredential = impl.issueCredential
export const verifyCredential = impl.verifyCredential
