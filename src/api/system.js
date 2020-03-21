import { axios } from '@/utils/request'

const api = {
  userList: 'uac/user/list',
  getUserDetail: 'uac/user/detail/', // username 携带权限等信息
  getUser: 'uac/user/get/', // id 不携带权限等信息
  saveUser: 'uac/user/save',
  delUser: 'uac/user/remove/',
  updateUser: 'uac/user/update',
  checkUsername:'uac/user/check/',

  getDeptTree: 'uac/dept/tree/',
  delDept:'uac/dept/remove/',
  getDept:'uac/dept/get/',
  saveDept:'uac/dept/save',
  updateDept:'uac/dept/update',

  getMenuTree:'uac/menu/tree/',
  getMenu:'uac/menu/get/',
  delMenu:'uac/menu/remove/',
  saveMenu:'uac/menu/save',
  updateMenu:'uac/menu/update',
  getMenuCheckItem:'uac/menu/items',
  checkMenuCode:'uac/menu/check/',

  getRoleList:'uac/role/list',
  getRole:'uac/role/get/',
  delRole:'uac/role/remove/',
  saveRole:'uac/role/save',
  updateRole:'uac/role/update',
  checkRoleCode:'uac/role/check/',

  getDictTree:'uac/dict/tree/',
  getDict:'uac/dict/get/',
  getDictList:'uac/dict/list',
  delDict:'uac/dict/remove/',
  saveDict:'uac/dict/save',
  updateDict:'uac/dict/update',
  getDictChild:'uac/dict/getChild/',
  checkDictCode:'uac/dict/check/'
}

export default api

/*用户*/
export function getUserList (parameter) {
  return axios({
    url: api.userList,
    method: 'post',
    data: parameter
  })
}

export function getUserDetail (parameter) {
  return axios({
    url: api.getUserDetail + parameter,
    method: 'get'
  })
}

export function getUser (parameter) {
  return axios({
    url: api.getUser + parameter,
    method: 'get'
  })
}

export function checkUsername (parameter) {
  return axios({
    url: api.checkUsername + parameter,
    method: 'get'
  })
}

export function saveUser (parameter) {
  return axios({
    url: api.saveUser,
    method: 'post',
    data: parameter
  })
}

export function delUser (parameter) {
  return axios({
    url: api.delUser + parameter,
    method: 'get'
  })
}

export function updateUser (parameter) {
  return axios({
    url: api.updateUser,
    method: 'post',
    data: parameter
  })
}
/*部门*/
export function getDeptTree (parameter) {
  return axios({
    url: api.getDeptTree+parameter,
    method: 'get'
  })
}

export function delDept (parameter) {
  return axios({
    url: api.delDept+parameter,
    method: 'get'
  })
}

export function getDept (parameter) {
  return axios({
    url: api.getDept+parameter,
    method: 'get'
  })
}

export function saveDept (parameter) {
  return axios({
    url: api.saveDept,
    method: 'post',
    data: parameter
  })
}

export function updateDept (parameter) {
  return axios({
    url: api.updateDept,
    method: 'post',
    data: parameter
  })
}
/*资源*/
export function getMenuTree (parameter) {
  return axios({
    url: api.getMenuTree+parameter,
    method: 'get'
  })
}

export function getMenu (parameter) {
  return axios({
    url: api.getMenu+parameter,
    method: 'get'
  })
}

export function checkMenuCode (parameter) {
  return axios({
    url: api.checkMenuCode + parameter,
    method: 'get'
  })
}

export function delMenu (parameter) {
  return axios({
    url: api.delMenu+parameter,
    method: 'get'
  })
}

export function saveMenu (parameter) {
  return axios({
    url: api.saveMenu,
    method: 'post',
    data: parameter
  })
}

export function updateMenu (parameter) {
  return axios({
    url: api.updateMenu,
    method: 'post',
    data: parameter
  })
}

export function getMenuCheckItem (parameter) {
  return axios({
    url: api.getMenuCheckItem,
    method: 'get'
  })
}
/*角色*/
export function getRoleList (parameter) {
  return axios({
    url: api.getRoleList,
    method: 'post',
    data: parameter
  })
}

export function getRole (parameter) {
  return axios({
    url: api.getRole + parameter,
    method: 'get'
  })
}

export function checkRoleCode (parameter) {
  return axios({
    url: api.checkRoleCode + parameter,
    method: 'get'
  })
}

export function delRole (parameter) {
  return axios({
    url: api.delRole + parameter,
    method: 'get'
  })
}

export function saveRole (parameter) {
  return axios({
    url: api.saveRole,
    method: 'post',
    data: parameter
  })
}

export function updateRole (parameter) {
  return axios({
    url: api.updateRole,
    method: 'post',
    data: parameter
  })
}
/*字典*/
export function getDictTree (parameter) {
  return axios({
    url: api.getDictTree + parameter,
    method: 'get'
  })
}

export function getDict (parameter) {
  return axios({
    url: api.getDict + parameter,
    method: 'get'
  })
}

export function checkDictCode (parameter) {
  return axios({
    url: api.checkDictCode + parameter,
    method: 'get'
  })
}

export function delDict (parameter) {
  return axios({
    url: api.delDict + parameter,
    method: 'get'
  })
}

export function saveDict (parameter) {
  return axios({
    url: api.saveDict,
    method: 'post',
    data: parameter
  })
}

export function updateDict (parameter) {
  return axios({
    url: api.updateDict,
    method: 'post',
    data: parameter
  })
}

export function getDictChild (parameter) {
  return axios({
    url: api.getDictChild + parameter,
    method: 'get'
  })
}

export function getDictList (parameter) {
  return axios({
    url: api.getDictList,
    method: 'post',
    data: parameter
  })
}