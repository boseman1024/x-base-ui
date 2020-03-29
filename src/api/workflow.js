import { axios } from '@/utils/request'

const api = {
	getProcessDefinitionList: 'workflow/process/list',
	processDefinitionBase: 'workflow/rest/process-definition/',
	deploymentBase:'workflow/rest/deployment/create'
}

export default api

export function getProcessDefinitionList (parameter) {
  return axios({
    url: api.getProcessDefinitionList,
    method: 'post',
    data:parameter
  })
}

export function delProcessDefinitionById (parameter) {
  return axios({
    url: api.processDefinitionBase+parameter,
    method: 'delete'
  })
}

export function getProcessDefinitionXmlById (parameter) {
  return axios({
    url: api.processDefinitionBase+parameter+'/xml',
    method: 'get'
  })
}

export function createProcess (parameter) {
  const params = new FormData()
  const xmlBlob = new Blob([parameter.xml])
  params.append('deploy-changed-only', parameter.update)
  params.append('enable-duplicate-filtering', parameter.update)
  params.append('deployment-name', parameter.deploymentName)
  params.append('deployment-source', parameter.deploymentSource)
  params.append('data', xmlBlob,'xml.bpmn')
  return axios({
    url: api.deploymentBase,
    method: 'post',
    data:params
  })
}
