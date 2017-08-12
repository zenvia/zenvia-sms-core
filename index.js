#!/usr/bin/env node


/**
 * Zenvia SMS Core for NodeJS
 *
 * Full documentation on -> http://docs.zenviasms.apiary.io
 *
 * @author Jonatas Freitas <jonatasfreitasv@gmail.com> (https://github.com/jonatasfreitasv)
 * @copyright 2013-2015
 * @license MIT
 */

const api = require('./lib/api');
const cs = require('./lib/callbacksServer');

module.exports = {
  api,
  callbacksServer: cs,
};
