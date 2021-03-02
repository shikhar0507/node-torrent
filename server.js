'use strict';

const tracker = require('./tracker')
const torrentParser = require('./torrent-parser');

const torrent = torrentParser.openTorrent('./kaisen.torrent')


tracker.getPeers(torrent,peers=>{
    console.log('found ',peers.length,' peers')
})

