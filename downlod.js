/**
Download from peers

**/

'use strict';

const net = require('net')
const socket = new net.Socket();


module.exports.download = (peers) => {

    download(peers)
}


const download = (peers) => {

    socket.on('error',console.error)

    socket.connect(port,ip,()=>{
	socket.write()
    })

    socket.on('data',(respBuff)=>{
	console.log(respBuff)
    })
}

