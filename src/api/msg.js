import { axios } from '@/utils/request'

const api = {
	socket:'',
	saveMsg: 'msg/message/save',
}

export default api

export function saveMsg (parameter) {
  return axios({
    url: api.saveMsg,
    method: 'post',
    data: parameter
  })
}
