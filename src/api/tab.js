import request from '@/utils/request'

export function getConfig(code) {
  return request({
    url: '/tabs/config',
    method: 'post',
    data: { code }
  })
}
