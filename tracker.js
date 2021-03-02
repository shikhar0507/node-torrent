const dgram = require('dgram');
const Buffer = require('buffer').Buffer;
const parse = require('url').parse;
const crypto = require('crypto');
const torrentParser = require('./torrent-parser')
const utils = require('./utils');

module.exports.getPeers = (torrent,callback) =>{
    const socket = dgram.createSocket('udp4');
    const rawUrl = torrent.announce.toString('utf8');
    
    // send request to connect
    
    let done = false;
    let n = 0;  
    const interval = setInterval(()=>{
	if(done == true) return clearInterval(interval);
	n = 1;
	trackerUtils.updSend(socket,trackerUtils.buildConnReq(),rawUrl,()=>{
	    console.log('send connection request')
	})
    },n ?  (2**n)*15*1000 : 500)

    

    socket.on('message', (response) => {
	done = true;
        
	
        switch(trackerUtils.respType(response)) {
            case "connect":
                // parse connected request's response
                const connectRes = trackerUtils.parseConnRes(response);

                // create announce req
            const announceReq = trackerUtils.buildAnnounceReq(connectRes.connectionId,torrent);
            trackerUtils.updSend(socket,announceReq,rawUrl,()=>{
		console.log("announce req send")
	    })
                break;
            case "announce":
                //parse announce response
                const announceRes = trackerUtils.parseAnnounceRes(response);
                callback(announceRes.peers)
                break;
            default:
                console.log("not able to detect response type")
                break;
        }
    })
}

const trackerUtils = (()=>{

    const udpSend = (socket,message,rawUrl,callback) =>{
	const url = parse(rawUrl);
        socket.send(message,0,message.length,url.port,url.hostname,(err)=>{
	    if(!err) return callback()
	    console.error(err)
	})
        
    }
    const respType = (resp) => {
	const action =resp.readUInt32BE(0);
	if(action ==0) return "connect";
	if(action == 1) return "announce";
    }
    const buildConnReq = () => {
	const buff = Buffer.alloc(16);
	//conn id
	buff.writeUInt32BE(0x417,0);
	buff.writeUInt32BE(0x27101980,4);
	//action
	buff.writeUInt32BE(0,8);
	//random
	crypto.randomBytes(4).copy(buff,12);
	return buff;
	
    }
    const parseConnRes = (resp) => {
	return {
	    action: resp.readUInt32BE(0),
	    transactionId:resp.readUInt32BE(4),
	    connectionId:resp.slice(8)
	}
    }
    const buildAnnounceReq = (connId,torrent,port=6881) => {
	const buff = Buffer.alloc(98)
	//connection id
	connId.copy(buff,0)
	//action
	buff.writeUInt32BE(1,8)
	//transactionId
	crypto.randomBytes(4).copy(buff,12)
	//info hash
	torrentParser.infoHash(torrent).copy(buff,16)
	//peer id
	utils.generatePeerId().copy(buff,36)
	//downloaded
	Buffer.alloc(8).copy(buff,56)
	//left
	torrentParser.size(torrent).copy(buff, 64);
	//uploaded
	Buffer.alloc(8).copy(buff,72)
	//event
	buff.writeUInt32BE(0,80)
	//ip address
	buff.writeUInt32BE(0,84)
	//key
	crypto.randomBytes(4).copy(buff,88)
	//num_want
	buff.writeInt32BE(-1,92)
	//port
	buff.writeUInt16BE(port,96)
	return buff;
    }
    const parseAnnounceRes = (resp) => {

	const peersSlice = resp.slice(20)
	
	let grps = [];
	for(i = 0;i<peersSlice.length;i += 6) {
	    grps.push(peersSlice.slice(i,i+6))
	}

	return {
	    action:resp.readUInt32BE(0),
	    transaction_id:resp.readUInt32BE(4),
	    interval:resp.readUInt32BE(8),
	    leechers:resp.readUInt32BE(12),
	    seeders:resp.readUInt32BE(16),
	    peers:grps.map(address=>{
		return {
		    ip:address.slice(0,4).join("."),
		    port:address.slice(4)
		}
	    })
	}
    }
    return {
        updSend:udpSend,
        respType:respType,
        buildConnReq:buildConnReq,
        buildAnnounceReq:buildAnnounceReq,
        parseConnRes:parseConnRes,
        parseAnnounceRes:parseAnnounceRes
    }
})();


