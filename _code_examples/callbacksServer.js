#!/usr/bin/env node


/**
 * Zenvia SMS Callbacks Server - Usage Examples
 *
 * Functions:
 *      startServer(port) - Set API Credentials
 *      events - Promise to listen received data from Zenvia SMS Servers
 *
 *
 * Delivery status example:
 *   {
 *     "callbackMtRequest": {
 *       "status": "03",
 *       "statusMessage": "Delivered",
 *       "statusDetail": "120",
 *       "statusDetailMessage": "Message received by mobile",
 *       "id": "hs765939216",
 *       "received": "2014-08-26T12:55:48.593-03:00",
 *       "mobileOperatorName": "any"
 *     }
 *   }
 *
 * Received SMS example:
 *  {
 *     "callbackMoRequest": {
 *       "id": "20690090",
 *       "mobile": "5551999999999",
 *       "shortCode": "40001",
 *       "account": "zenvia.account",
 *       "body": "Message content",
 *       "received": "2014-08-26T12:27:08.488-03:00",
 *       "correlatedMessageSmsId": "hs765939061"
 *     }
 *  }
 *
 */


const zenviaCS = require('../index').callbacksServer;

zenviaCS.startServer(81);

zenviaCS.events.on('event', (data) => {
  console.log(data);
});
