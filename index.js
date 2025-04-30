import './tracker.js';
import torentParser from './torent-parser.js';
const torent = torentParser.open('./puppy.torrent');

const peers = tracker.getpeers(torent, peer => {
  console.log(peer);
})


