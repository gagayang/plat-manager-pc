import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {

  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { path: window.location.pathname })
}

export function removeToken() {
  return Cookies.remove(TokenKey, { path: window.location.pathname })
}
