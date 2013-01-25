'use strict';

/**
 * Corrects some keys that are incorrectly reported by nodejs readline
 *
 * @name shimKey
 * @function
 * @param code {String} key code
 * @param key {Object} key
 */
module.exports = function shimKey(code, key) {
  if (key.name === '`' && key.ctrl) key.name = 'space';

  return { code: code, key: key };
};
