'use strict';

import crypto from 'crypto';

const id = null;

module.exports.generateId = () => {
  if (!id) {
    id = crypto.randomBytes(20);
    Buffer.from('-TC0001-').copy(id, 0);
  }
  return id;
}
