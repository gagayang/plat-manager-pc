import request from '@/utils/request'

export function getFromMetaData(params) {
  return request({
    url: '/form/meta/' + params.code,
    method: 'get',
    params: params
  })
}

export function getFormData(url, params) {
  return request({
    url: url,
    method: 'get',
    params: params
  })
}

export function submitForm(url, params) {
  return request({
    url: url,
    method: 'post',
    data: params
  })
}
