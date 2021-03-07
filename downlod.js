'use strict';

const net = require('net')
const socket = new net.Socket();


module.exports.download = (peer) => {

    download(peer)
}


const download = (peer) => {

    socket.on('error',console.error)
    console.log(peer)
    socket.connect(peer.port,peer.ip,()=>{
//	socket.write()
    })

    socket.on('data',(respBuff)=>{
	console.log(respBuff)
    })
}

