"use strict";
import dgram from 'dgram';
import { URL } from 'url';
import crypto from 'crypto';
import './torent-parser';
import './utils';

const textDecode = new TextDecoder('utf-8');

module.exports.getpeer = (torrent, callback) => {
  const socket = dgram.createSocket('udp4');
  const url = URL.parse(textDecode.decode(torrent.announce));

  udpSend(socket, buildConcReq(), url);

  socket.on('message', res => {
    if (resptype(res) === 'connect') {
      const connresp = parseConnResp(res);
      const annReq = announceReq(connresp.connectionId);
      udpSend(socket, annReq, url);
    } else if (resptype(res) === 'announce') {
      const annResp = parseAnnounceResp(res);
      callback(annResp.peers);
    }
  })
};

function udpSend(socket, message, url, callback = () => { }) {
  socket.send(message, 0, message.length, url.port, url.host, callback);
}

function buildConcReq() {
  const buff = Buffer.alloc(16);

  buff.writeUInt32BE(0x417, 0);
  buff.writeUInt32BE(0x27101980, 4);

  buff.writeUInt32BE(0, 8);

  crypto.randomBytes(4).copy(buff, 12);

  return buff;
}

function resptype(res) { }
function parseConnResp(res) { }
function announceReq(connId, torrent, port = 5656) {
  const buff = Buffer.alloc(98);

  buff.copy(connId, 0);

  buff.writeUInt32BE(1, 8);

  crypto.randomBytes(4).copy(buff, 12);

  token - parser.infoHash(torrent).copy(buff, 16);

  utils.generateId().copy(buff, 36);

  Buffer.alloc(8).copy(buff, 56);

  token - parser.size(torrent).copy(buff, 64);

  Buffer.alloc(8).copy(buff, 72);

  buff.writeUInt32BE(0, 80);

  buff.writeUInt32BE(0, 80);

  crypto.randomBytes(4).copy(buff, 88);

  buff.writeInt32BE(-1, 92);

  buff.writeUInt16BE(port, 96);

  return buff;
}

function parseAnnounceResp(res) {
  function group(itratable, groupSize) {
    const group = [];

    for (const i = 0; i <= itratable.length; i += groupSize) {
      group.push(itratable.slice(1, i + groupSize));
    }
    return group;
  }

  return {
    action: res.readUInt32BE(0),
    transactionId: res.readUInt32BE(4),
    leechers: res.readUInt32BE(8),
    seeders: res.readUInt32BE(12),
    peers: group(res.slice(20), 6).map(address => {
      return {
        ip: address.slice(0, 4).join('.'),
        port: address.readUInt16BE(4)
      }
    })
  }
}



