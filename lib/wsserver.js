'use strict';

const WS = require('ws');
const HTTP = require('http');
const UUIDv4 = require('uuid/v4');

const Defaults = {
  port: 3000,
};

class WSServer {
  constructor (Config) {
    this.Config = Object.assign({}, Defaults, Config);
    this.httpServer = HTTP.createServer();
    this.wsServer = new WS.Server({ server: this.httpServer });
    let self = this;
    this.wsServer
      .on('connection', function (ws) {
        self.onConnect(ws);
        if (self.Config.onConnect) { self.Config.onConnect(ws); }
      })
      .on('error', function (err) {
        console.log('SERVER ERROR', err.message);
        process.exit(1);
      });
    this.httpServer.listen(this.Config.port, null, function () {
      console.log('Server up on port ' + self.Config.port);
    });
    this.connections = {};
  }

  onConnect (ws) {
    let self = this;
    let uuid = UUIDv4();
    self.connections[uuid] = { uuid: uuid, ws: ws };
    ws
      .on('message', function (message) {
        (self.Config.onMessage ? self.Config.onMessage(message, ws, uuid) : self.onMessage(message));
      })
      .on('close', function () {
        self.onClose(ws, uuid);
        if (self.Config.onClose) {
          self.Config.onClose(ws, uuid);
        }
        else {
          console.log('CLIENT CLOSED', uuid);
        }
      })
      .on('error', function (error) {
        (self.Config.onError ? self.Config.onError(err) : self.onError(err));
      });
  }

  onClose (ws, uuid) {
    delete this.connections[uuid];
  }

  onError (err) {
    console.log('SERVER ERROR', err);
  }

  onMessage (message) {
    console.log('MESSAGE:', message);
  }
}

module.exports = WSServer;
