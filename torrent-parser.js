'use strict';

const fs = require('fs');
const bencode = require('bencode');

module.exports.openTorrent = (path) =>{
    return bencode.decode(fs.readFileSync(path))
    
}

module.exports.size = torrent => {
    const bignum = require('bignum')
    const length = torrent.info.files ? torrent.info.files.map(file=>file.length).reduce((a,b)=>a+b) : torrent.info.length;
    return bignum.toBuffer(length,{size:8})
}

module.exports.infoHash = torrent => {
    const crypto = require('crypto');
    const info = bencode.encode(torrent.info)
    return crypto.createHash('sha1').update(info).digest();
    
}
