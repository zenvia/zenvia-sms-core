<img src="https://s3.amazonaws.com/owler-image/logo/zenvia-mobile_owler_20170111_192135_original.png" height="200" />

# Zenvia SMS Core for NodeJS

[![Build Status](https://travis-ci.org/zenvia/zenvia-sms-core.svg?branch=master)](https://travis-ci.org/zenvia/zenvia-sms-core)

Full and official implementation of Zenvia SMS API, send, monitor status and receive SMS from clients with this module.

##### Full documentation about Zenvia API on http://docs.zenviasms.apiary.io

### Install
`npm install @zenvia/zenvia-sms-core`

### How to create Zenvia SMS Callbacks Server

```javascript
let zcs = require('@zenvia/zenvia-sms-core').callbacksServer;

zcs.startServer(81);

zcs.events.on('event', (data)=>{
    console.log(data);
});
```

### How to use Zenvia SMS API

```javascript
/**
 * Available methods:
 *      setCredentials(account, password) - Set API Credentials
 *      sendSMS(payload) - Send unique and multiple SMS
 *      getSMSStatus(sms_id) - Get SMS status by ID
 *      getSMSReceivedList() - Get received SMS list
 *      getSMSReceivedListSearch(start_date, end_date) - Get received SMS list filtered by start and end date
 *      cancelScheduledSMS(sms_id) - Cancel scheduled SMS by id
 *
 */

const zapi = require('@zenvia/zenvia-sms-core').api;

zapi.setCredentials('account', 'password');

/* Send unique short and long SMS example
 */
   zapi.sendSMS({
            sendSmsRequest: {
                from: "Zenvia",
                to: "5551999999999",
                schedule: null,
                msg: "Hello Zenvia from NodeJS!!!",
                callbackOption: "ALL",
                id: '001',
                aggregateId: "002"
            }
        })
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.error(err);
        });
```

### For full examples see on `_code_examples/` and `_payload_examples` in this project.

# Development

run `npm install`.

### Make tests
for success send SMS tests case in api, fill `zenvia_phonenumber`, `zenvia_account`, `zenvia_password` on env variables.

run `npm test`.

### To Do
- create full examples to getSMSStatus, getSMSReceivedList, getSMSReceivedListSearch, cancelScheduledSMS
- getSMSStatus not working, possible Zenvia API bug
- getSMSReceivedList not working, possible Zenvia API bug
- getSMSReceivedListSearch not working, possible Zenvia API bug
- make callbacksServer unit tests
- Review license
- Review english

#### Under MIT License
