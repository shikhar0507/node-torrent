'use strict';

const tracker = require('./tracker')
const fs = require('fs');
const bencode = require('bencode');

const torrent = bencode.decode(fs.readFileSync('./file.torrent'))
tracker.getPeers(torrent,peers=>{
    console.log(peers)
})
