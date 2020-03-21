import { axios } from '@/utils/request'

const api = {
  Login: '/auth/login',
  Logout: '/auth/logout',
  SendSms: '/account/sms',
}

export default api

const authUsername = 'admin'
const authPassword = 'admin'

export function login (parameter) {
  const params = new URLSearchParams()
  params.append('grant_type', 'password')
  params.append('username', parameter.username)
  params.append('password', parameter.password)
  return axios({
    url: 'auth/oauth/token',
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    auth: {
      username: authUsername,
      password: authPassword
    },
    data: params
  })
}

export function RefreshToken (parameter) {
  const params = new URLSearchParams()
  params.append('grant_type', 'refresh_token')
  params.append('refresh_token', parameter)
  return axios({
    url: 'auth/oauth/token',
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    auth: {
      username: authUsername,
      password: authPassword
    },
    data: params
  })
}

export function getSmsCaptcha (parameter) {
  return axios({
    url: api.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return axios({
    url: 'uac/user/current',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout () {
  return axios({
    url: 'auth/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}