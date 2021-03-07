/**
Download from peers

**/

'use strict';

const net = require('net')
const message = require('./message');

class Requested {
    constructor() {
	this.requested = {}
    }
    get list() {
	return this.requested
    }
    setIndex(index) {
	this.requested[index] = true
    }
    hasIndex(index) {
	return this.reqested[index]
    }
}

const requested = new Requested()

module.exports.download = (peer,torrent) => {

    download(peer,torrent)
}


const download = (peer,torrent) => {
    const socket = new net.Socket();
    socket.on('error',err=>{})
    socket.connect(peer.port,peer.ip,()=>{
	
	socket.write(message.buildHandshake(torrent))
    })
    onFullMessage(socket,(data)=>{
	//	console.log(data)
	if(isHandhshakeMessage(data,socket)) {
	    socket.write(message.interested())
	    return;
	}
	const parsed = handleOtherMessages(data)
	if(!parsed) return
	switch(parsed) {
	case 0:
	    handleChoke()
	    break;
	case 1:
	    handleUnchoke()
	    break;
	case 4:
	    handleHave()
	    break;
	case 5:
	    handleBitField()
	    break;
	case 7:
	    handlePiece()
	    break;
	}
	
	
    })
   
}

const handleChoke = () => {

}

const handleUnchoke = () => {

}
const handleHave = (payload,socket) => {
    const pieceIdx = payload.readUInt32BE(0)
    if(!requested.hasIndex(pieceIdx)) {
	socket.write(message.request(payload))
    }
    requested.setIndex(pieceIdx)
}

const handleBitField = () => {

}

const handlePiece = () => {

}

const handleOtherMessages = (data) => {
    if(data.length < 4) {
	console.log('less',data.readInt8(0))
	return null;
    }
    
    const id = data.length > 4 ? data.readUInt8(4) : null;
    let payload = data.length > 5 ? data.slice(5) : null;
    // cancel,peice,request : messages with payload
    
    switch(id) {
    case 6:
    case 7:
    case 8:
	payload = {
	    index:payload.readUInt32BE(0),
	    begin:payload.readUInt32BE(4)
	}
	payload[id ==7 ? 'block':'length'] = payload.slice(8)
	break;
    }
    return  {
	size:data.readInt32BE(0),
	id:id,
	payload:payload
    }
    
}

const isHandhshakeMessage = (data,socket) => {
    
    return data.length == 68 &&  data.toString('utf8',1) === "BitTorrent Protocal";
}


// to be dealt with later
const onFullMessage = (socket,callback) => {
   // console.log('init')
    let savedBuff  = Buffer.alloc(0)
    let isHandshake = true
    
     socket.on('data',(respBuff)=>{
	
	 const msgLength = () => {
	     if(isHandshake) return 68;
	   
	     return savedBuff.readInt32BE(0) + 4
	 };
	
	 savedBuff = Buffer.concat([savedBuff,respBuff])
	// console.log(savedBuff.length,msgLength())
	 const len = msgLength()
	 while(savedBuff.length >=4  && savedBuff.length >= len) {
	  
	     callback(savedBuff.slice(0,len))

	     savedBuff = savedBuff.slice(len);
	     isHandshake = false;
		      
	 }
     })
     
}
