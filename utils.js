'use strict';

const crypto = require("crypto");

let id = null;

module.exports.generatePeerId = () => {

    if(!id) {
	id = crypto.randomBytes(20)
	Buffer.from('-SK0001-').copy(id,0);
    }
    return id;
}
