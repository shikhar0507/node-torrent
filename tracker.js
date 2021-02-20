const dgram = require('dgram');
const Buffer = require('buffer').Buffer;
const parse = require('url').parse;

module.exports.getPeers = (torrent,callback) =>{
    const socket = dgram.createSocket('udp4');
    const rawUrl = torrent.announce.toString('utf-8');
    
    // send request to connect
    trackerUtils.updSend(socket,trackerUtils.buildConnReq(),rawUrl,()=>{
        console.log('send')
    })

    socket.on('message', (response) => {
        console.log(response)
        switch(trackerUtils.respType(response)) {
            case "connect":
                // parse connected request's response
                const connectRes = trackerUtils.parseConnRes(response);

                // create announce req
                const announceReq = trackerUtils.buildAnnounceReq(connectRes.connId);
                trackerUtils.updSend(socket,announceReq,rawUrl)
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

    const udpSend = (socket,rawUrl,message,callback) =>{
        const url = parse(rawUrl);
        socket.send(message,0,message.length,url.port,url.host,callback)
    }
    const respType = () => {

    }
    const buildConnReq = () => {

    }
    const parseConnRes = () => {

    }
    const buildAnnounceReq = () => {

    }
    const parseAnnounceRes = () => {

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
