import { createProdMockServer } from 'vite-plugin-mock/client'

import authMock from '../mock/auth'
import clusterMock from '../mock/cluster'
import configMock from '../mock/config'
import demoMock from '../mock/demo'
import namespaceMock from '../mock/namespace'
import permissionMock from '../mock/permission'
import roleMock from '../mock/role'
import serviceMock from '../mock/service'
import systemMock from '../mock/system'
import userMock from '../mock/user'

export function setupProdMockServer() {
  createProdMockServer([
    ...authMock,
    ...clusterMock,
    ...configMock,
    ...demoMock,
    ...namespaceMock,
    ...permissionMock,
    ...roleMock,
    ...serviceMock,
    ...systemMock,
    ...userMock,
  ])
}
