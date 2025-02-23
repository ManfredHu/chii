const Channel = require('./Channel');
const Emitter = require('licia/Emitter');
const truncate = require('licia/truncate');
const ansiColor = require('licia/ansiColor');
const util = require('./util');

module.exports = class ChannelManager extends Emitter {
  constructor() {
    super();

    this._targets = {};
    this._clients = {};
  }
  createTarget(id, ws, url, title, favicon) {
    console.log('createTarget(): id, url, title, favicon', id, url, title, favicon);
    const channel = new Channel(ws);

    util.log(`${ansiColor.yellow('target')} ${id}:${truncate(title, 10)} ${ansiColor.green('connected')}`);
    this._targets[id] = {
      id,
      title,
      url,
      favicon,
      channel,
    };

    channel.on('close', () => this.removeTarget(id, title));
    console.log('channel target add', this._targets);
    this.emit('target_changed');
  }
  createClient(id, ws, target) {
    console.log('createClient(): id, ws, target', id, ws);
    target = this._targets[target];
    if (!target) {
      return ws.close();
    }

    const channel = new Channel(ws);
    util.log(
      `${ansiColor.blue('client')} ${id} ${ansiColor.green('connected')} to target ${target.id}:${truncate(
        target.title,
        10
      )}`
    );
    channel.connect(target.channel);

    this._clients[id] = {
      id,
      target: target.id,
      channel,
    };
    console.log('channel client add', this._clients)
    channel.on('close', () => this.removeClient(id));
    target.channel.on('close', () => channel.destroy());
  }
  removeTarget(id, title = '') {
    util.log(`${ansiColor.yellow('target')} ${id}:${title} ${ansiColor.red('disconnected')}`);
    delete this._targets[id];
    console.log('channel removeTarget', this._targets);
    this.emit('target_changed');
  }
  removeClient(id) {
    util.log(`${ansiColor.blue('client')} ${id} ${ansiColor.red('disconnected')}`);
    console.log('channel removeClient', this._targets);
    delete this._clients[id];
  }
  getTargets() {
    return this._targets;
  }
  getClients() {
    return this._clients;
  }
};
