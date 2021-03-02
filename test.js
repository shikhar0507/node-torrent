const crypto = require("crypto");
const buff = Buffer.alloc(60)
for (i =0;i<60;i++){
    crypto.randomBytes(4).copy(buff,i)
}
//console.log(buff)
const sl = buff.slice(20)
console.log(sl)

let groups = [];
for (i=0;i<sl.length;i+=6){
    console.log(i,sl.slice(i,i+6))
    groups.push(sl.slice(i,i+6))
}
const s = groups.map(add=>{
    
    return {
	'ip':add.slice(0,4).join('.'),
	port:add.readUInt16BE(2)
   }
})
console.log(s)
