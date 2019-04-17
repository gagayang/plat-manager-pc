import request from '@/utils/request'

export function getConfig(path) {
  path = decodeURIComponent(path)
  return request({
    url: path,
    method: 'get'
  })
}

export function ajaxSend(params) {
  const url = params.url|| params.path
  const type = params.ajaxType
  if(_.toLower(type) === 'post'){
    return request({
      url: url,
      method: type,
      data: params.params
    })
  } else {
    return request({
      url: url,
      method: type,
      params: params.params
    })
  }
}
