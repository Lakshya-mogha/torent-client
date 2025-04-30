"use strict";

import fs from 'fs';
import bencode from 'bencode';

module.exports.openFile = (path) => {
  return bencode.decode(fs.readFileSync(path));
}

module.exports.size = () = {

}

module.exports.infoHash = () = {

}
