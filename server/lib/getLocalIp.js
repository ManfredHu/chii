const interfaces = require('os').networkInterfaces(); //服务器本机地址
let IPAdress = '';
for (var devName in interfaces) {
  var iface = interfaces[devName];
  for (var i = 0; i < iface.length; i++) {
    var alias = iface[i];
    // ipv4非 127.0.0.1 且是对外IP
    if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
      IPAdress = alias.address;
    }
  }
}

exports.IPAdress = IPAdress;
