
// create the websocket server with listeners
const WSServer = require('./lib/wsserver');
let server = new WSServer({
  port: 8080,
  onConnect: (ws) => {
    console.log('Client connected');
  },
  onClose: () => {
    console.log('Client closed');
  },
  onError: (error) => {
    console.log('Client error', error.message);
  },
  onMessage: (message, ws, uuid) => {
    processMessage(message, ws);
  }
});


// process a message from a client
function processMessage (message, ws) {
  // convert the message string into an object
  let obj;
  try {
    obj = JSON.parse(message);
  }
  catch (error) {
    console.log('Message is not JSON.', message);
    return;
  }
  processMessageType(obj, ws);
}


// process message object type
function processMessageType (obj, ws) {
  // handle message object
  switch(obj.type) {
    case 'ping':
      ws.send(JSON.stringify({ type: 'pong' }));
      break;

    default:
      console.log('Unknown message object type ' + obj.type);
  }
}
