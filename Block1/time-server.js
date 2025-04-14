const net = require('net')
const port = process.argv[2];
function zeroFill(n) {
    return n < 10 ? '0' + n : '' + n;
  }
const date = new Date();
const server = net.createServer(function(socket){
    const year = date.getFullYear();
    const month = zeroFill(date.getMonth() + 1);
    const day = zeroFill(date.getDate());
    const hour = zeroFill(date.getHours());
    const minute = zeroFill(date.getMinutes());
    const formatted = `${year}-${month}-${day} ${hour}:${minute}\n`;
    socket.end(formatted)
})
server.listen(port);