'use strict';

const tracker = require('./tracker')
const torrentParser = require('./torrent-parser');
const download = require('./download');
const torrent = torrentParser.openTorrent('./file.torrent')


tracker.getPeers(torrent,peers=>{

    peers.forEach(peer=>download.download(peer,torrent))
    
    console.log('found ',peers.length,' peers')
   // download.download(peers[5],torrent)
})

