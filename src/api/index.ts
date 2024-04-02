import useAxiosApi from '~/utils/useAxiosApi';
import moment from 'moment';
import Cookies from 'js-cookie'
/**
 * 账号密码登录
 * @returns UseAxiosReturn
 */
export function loginPassword() {
  return useAxiosApi(`/api/login`, {
    method: 'POST',
    data: { name: '123' },
  });
}
export async function getRemoteDomain() {
  const t = Cookies.get('expiresIn');
  const now = moment();
  if (!t || moment.unix(t).isBefore(now, 's')) {
    // 需要重新请求token
    const {access_token, expires_in} = await getApiToken();
    Cookies.set('expiresIn', moment().add(expires_in, 's').valueOf());
    sessionStorage.setItem('at', access_token)
  }

  const accessToken = sessionStorage.getItem('at');
  return useAxiosApi(`http://172.16.7.172:8778/open_api/customization/tgxwbymsq/full`, {
    method: 'POST',
    data: {
      access_token: accessToken,
      page: 1,
      per_page: 10000
    },
  });
}

export function getApiToken() {
  return useAxiosApi(`http://172.16.7.172:8778/open_api/authentication/get_access_token`, {
    method: 'GET',
    params: {
      key: '20240307742217655445341477355521323',
      secret: '61dd93cb6b695f1946c1b3d0976b1c77ecf1aca1'
    }
  });
}

export function addLocalDomain(data) {
  return useAxiosApi(`/domains`, {
    method: 'post',
    data
  });
}

export function updateLocalDomain(data) {
  return useAxiosApi(`/domains/update`, {
    method: 'put',
    data
  });
}

export function getLocalDomain(params) {
  return useAxiosApi(`/domains`, {
    method: 'get',
    params
  });
}

export function refreshLocalIP() {
  return useAxiosApi(`/refreshLocalIp`, {
    method: 'get',
    params: null
  });
}

export function refreshPublicIP() {
  return useAxiosApi(`/refreshIp`, {
    method: 'get',
    params: null
  });
}

export function getEvents(params) {
  return useAxiosApi(`/events`, {
    method: 'get',
    params
  });
}

export function addEvents(data) {
  return useAxiosApi(`/events`, {
    method: 'post',
    data
  });
}

export function getDoubleNonDomain(params) {
  return useAxiosApi(`/doubleDomains`, {
    method: 'get',
    params
  });
}

export function getQAItems(params) {
  return useAxiosApi(`/qaItems`, {
    method: 'get',
    params
  });
}

export function updateQAItems(data) {
  return useAxiosApi(`/qaItems/update`, {
    method: 'put',
    data
  });
}

export function addQAItems(data) {
  return useAxiosApi(`/qaItems/add`, {
    method: 'post',
    data
  });
}

export function deleteQAItems(id: number) {
  return useAxiosApi(`/qaItems/delete/${id}`, {
    method: 'delete'
  });
}

