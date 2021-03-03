/** 
Handle messaging
**/

'use strict';

const hash = require('./torrent-parser').infoHash;
const peerId = required('./utils').generatePeerId;

module.exports.buildHandshake = (torrent) => {
    
    //pstrlen 19
    // pstr 1
    //reserved 8
    //info hash 20
    // peer id 20
    
    const buff = Buffer.alloc(98);

    //pstrlen
    buff.writeUInt8(19,0)

    //pstr
    buff.write("BitTorrent protocol",1)

    //reserved
    buff.writeUInt32BE(0,20)
    buff.writeUInt32BE(0,24)

    //info_hash
    hash(torrent).copy(buff,28)

    //peer id
    peerId().copy(buff,48);

}

// keep-alive: <len=0000>
// name changed to bee gees stayin alive
module.exports.stayinAlive = () =>{
    return Buffer.alloc(4,0)
}

//choke: <len=0001><id=0>

module.expoers.choke = () => {
    const buff = Buffer.alloc(5)
    buff.writeUInt32BE(1,0)
    //id
    buff.writeUInt8(0,4)
    return buff;
}

//unchoke: <len=0001><id=1>

module.exports.unchoke = () => {
    const buff = Buffer.alloc(5)
    buff.writeUInt32BE(1,0)
    buff.writeUInt8(1,4)
    return buff
}

//interested: <len=0001><id=2>
module.exports.interested = () => {
    const buff = Buffer.alloc(5)
    buff.writeUInt32BE(1,0)
    buff.writeUInt8(2,4)
}

// not interested: <len=0001><id=3>
module.exports.uninterested = () => {
    const buff = Buffer.alloc(5)
    buff.writeUInt32BE(1,0)
    buff.writeUInt8(3,4)
}

//have: <len=0005><id=4><piece index>

//bitfield: <len=0001+X><id=5><bitfield>

//request: <len=0013><id=6><index><begin><length>
module.exports.request = (payload) => {
    const buff = Buffer.alloc(17)
    buff.writeUInt32BE(0013,0)
    buff.writeUInt8(6,4)
    buff.writeUInt32BE(payload.index,5)
    buff.writeUInt32BE(payload.begin,9)
    buff.writeUInt32BE(payload.length,13)
    return buff
}

//piece: <len=0009+X><id=7><index><begin><block>
module.exports.piece = (payload) => {
    const buff = Buffer.alloc(payload.block.length+13)
    
    buff.writeUInt32BE(0009+payload.block.length,0)
    buff.writeUInt8(7,4)
    buff.writeUInt32BE(payload.index,5)
    buff.writeUInt32BE(payload.begin,9)
    payload.block.copy(buff,13)
    return buff
   
    return buff
}



//cancel: <len=0013><id=8><index><begin><length>
module.exports.cancel = (payload) => {
    const buff = Buffer.alloc(17)
    buff.writeUInt32BE(0013,0)
    buff.writeUInt8(7,4)
    buff.writeUInt32BE(payload.index,5)
    buff.writeUInt32BE(payload.begin,9)
    buff.writeUInt32BE(payload.length,13)
    return buff
}
//port: <len=0003><id=9><listen-port>
module.exports.port = (port) => {

    const buff = Buffer.alloc(7)
    buff.writeUInt32BE(0003,0)
    buff.writeUInt8(9,4)
    buff.writeUInt16BE(payload,5)
    return buff
 
}
