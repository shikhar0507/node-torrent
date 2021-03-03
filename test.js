
const buff = Buffer.allocUnsafe(5)


buff.writeUInt32BE(100219312,0)
//buff.writeUInt8(0,4)
console.log(buff)
