import request from '@/utils/request'

export function getReportData(url, params) {
  return request({
    url: url,
    method: 'post',
    data: params
  })
}
export function ajaxSendBatch(params) {
  const url = params.url|| params.path
  const type = params.ajaxType
  if(_.toLower(type) === 'post') {
    return request({
      url: url,
      method: type,
      data: params.params
    })
  } else  {
    return request({
      url: url,
      method: type,
      params: params.params
    })
  }
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
export function exportSend(url, ajaxType, params) {
  let type = ''
  switch (ajaxType) {
    case 'post':
      type = 'data'
      break
    case 'get':
      type = 'params'
      break
  }
  return request({
    url: url,
    method: ajaxType,
    [type]: params,
    responseType: 'blob'
  })
}
