#!/usr/bin/env node

/**
 * Zenvia SMS Callbacks Server
 *
 * Functions:
 *      startServer(port) - Set API Credentials
 *      events - Promise to listen received data from Zenvia SMS Servers
 *
 * @author Jonatas Freitas <jonatasfreitasv@gmail.com> (https://github.com/jonatasfreitasv)
 * @license MIT
 */

const restify = require('restify');
const restifyp = require('restify-plugins');

const eventEmitter = require('events');
const figlet = require('figlet');

const server = restify.createServer({
  name: 'Zenvia SMS Callbacks Server',
});

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  return next();
});

class EventsEmitter extends eventEmitter {}
const events = new EventsEmitter();

server.use(restifyp.bodyParser({ mapParams: false }));

const exec = (req, res, next) => {
  res.send(200);
  events.emit('event', req.body);

  return next();
};

// TODO: Check with Zenvia Callbacks send request via GET or POST method
server.post('/', exec);
server.get('/', exec);

const serverStart = (port) => {
  server.listen(port, () => {
    figlet('Zenvia  SCS', (err, data) => {
      console.log('####################################################################################');
      console.log(data);
      console.log('##################### Zenvia SMS Callbacks Server start on %s', server.url);
      console.log('\n');
    });
  });
};

module.exports = {
  startServer: serverStart,
  events,
};
