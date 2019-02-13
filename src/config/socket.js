let websock = null
let count = 0
let t
let MAX = 1000

// 初始化weosocket
function initWebSocket () {
  let wsuri = 'localhost:8089' // ws地址
  websock = new WebSocket(wsuri)
  websock.onmessage = function (e) {
    websocketonmessage(e)
  }
  websock.onclose = function (e) {
    websocketclose(e)
  }
  websock.onopen = function () {
    websocketOpen()
  }

  websock.sendSock = sendSock
  // 连接发生错误的回调方法
  websock.onerror = function () {
    console.log('WebSocket连接发生错误')
  }
}

// 实际调用的方法
function sendSock (agentData, callback) {
  if (websock.readyState === websock.OPEN) {
    // 若是ws开启状态
    websocketsend(agentData)
  } else if (websock.readyState === websock.CONNECTING) {
    // 若是 正在开启状态，则等待1s后重新调用
    setTimeout(function () {
      sendSock(agentData, callback)
    }, 1000)
  } else {
    // 若未开启 ，则等待1s后重新调用
    setTimeout(function () {
      sendSock(agentData, callback)
    }, 1000)
  }
}

// 数据接收
function websocketonmessage (e) {
  // globalCallback(JSON.parse(e.data))
}

// 数据发送
function websocketsend (agentData) {
  websock.send(JSON.stringify(agentData))
}
let connection = function () {
  let url = 'localhost:8089' // ws地址
  websock = new WebSocket(url)
  websock.onopen = websocketOpen
  websock.onmessage = websocketonmessage
  websock.onclose = websocketclose
  websock.onerror = function () {
    console.log('WebSocket连接发生错误')
  }
}
let reconnection = () => {
  count = count + 1
  // 1与服务器已经建立连接
  if (count >= MAX || websock.readyState === 1) {
    clearTimeout(t)
  } else {
    // 2已经关闭了与服务器的连接
    if (websock.readyState === 3) {
      connection()
    }
    // 0正尝试与服务器建立连接,2正在关闭与服务器的连接
    t = setTimeout(() => {
      reconnection()
    }, 100)
  }
}
// 关闭
function websocketclose () {
  console.log('关闭成功')
  reconnection()
}

function websocketOpen () {
  console.log('连接成功')
}

// initWebSocket()

// export {websock, initWebSocket}
