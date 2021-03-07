let savedBuf = Buffer.alloc(0);
savedBuf = Buffer.concat([savedBuf, Buffer.alloc(1)]);

console.log(savedBuf.readUInt8(0) + 49)
