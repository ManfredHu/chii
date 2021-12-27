const WebSocket = require('ws');
const url = require('url');
const ChannelManager = require('./ChannelManager');
const query = require('licia/query');

module.exports = class WebSocketServer {
  constructor() {
    this.channelManager = new ChannelManager();

    const wss = (this._wss = new WebSocket.Server({ noServer: true }));

    wss.on('connection', ws => {
      const type = ws.type;
      console.log('websocket收到connection请求，类型为：', type);
      if (type === 'target') {
        const { id, chiiUrl, title, favicon } = ws;
        this.channelManager.createTarget(id, ws, chiiUrl, title, favicon);
      } else {
        const { id, target } = ws;
        this.channelManager.createClient(id, ws, target);
      }
    });
  }
  start(server) {
    console.log('websocket服务启动');
    const wss = this._wss;

    server.on('upgrade', function (request, socket, head) {
      console.log('server收到upgrade请求', decodeURIComponent(request.url));
      const urlObj = url.parse(request.url);
      const pathname = urlObj.pathname.split('/');
      // console.log('pathname', pathname) // pathname [ '', 'target', '6ug1gu' ]

      const type = pathname[1]; // target or client
      const id = pathname[2]; // random by target/index.ts

      console.log(`websocket服务upgrade type: ${type}`);
      if (type === 'target' || type === 'client') {
        wss.handleUpgrade(request, socket, head, ws => {
          ws.type = type;
          ws.id = id;
          const q = query.parse(urlObj.query);
          if (type === 'target') {
            ws.chiiUrl = q.url;
            ws.title = q.title;
            ws.favicon = q.favicon;
          } else {
            ws.target = q.target;
          }
          wss.emit('connection', ws, request);
        });
      } else {
        socket.destroy();
      }
    });
  }
};
