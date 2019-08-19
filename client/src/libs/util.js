import Cookies from 'js-cookie'

export const setTitle = (title) => {
  window.document.title = title || '大学排课系统首页'
}

export const setToken = (token, tokenName = 'token') => {
  Cookies.set(tokenName, token)
}

export const getToken = (tokenName = 'token') => {
  return Cookies.get(tokenName)
}
