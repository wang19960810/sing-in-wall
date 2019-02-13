// 设置cookie
function setCookie (name, value, expiredays) {
  let exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = name + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
}

// 取回cookie
function getCookie (name) {
  if (document.cookie.length > 0) {
    let start = document.cookie.indexOf(name + '=')
    if (start !== -1) {
      start = start + name.length + 1
      let end = document.cookie.indexOf(';', start)
      if (end === -1) end = document.cookie.length
      return unescape(document.cookie.substring(start, end))
    }
  }
  return ''
}

// 解析URL
function getQueryString (name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let href = window.location.hash.split('?')
  href = href.filter(item => item.indexOf(name) !== -1)
  if (href.length !== 0) {
    href = href[0].split(name + '=')[1]
  }
  let r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return unescape(r[2])
  } else if (href.length !== 0 && href !== null) {
    return href
  }
  return null
}

export {
  getQueryString,
  setCookie,
  getCookie
}
