#!/usr/bin/env node
'use strict';

/**
 * Zenvia SMS API - Usage Examples
 *
 * Functions:
 *      setCredentials(account, token) - Set API Credentials
 *      sendSMS(payload) - Send unique and multiple SMS
 *      getSMSStatus(sms_id) - Get SMS status by ID
 *      getSMSReceivedList() - Get received SMS list
 *      getSMSReceivedListSearch(start_date, end_date) - Get received SMS list filtered by start and end date
 *      cancelScheduledSMS(sms_id) - Cancel scheduled SMS by id
 *
 */

const zapi = require('../index').api;

zapi.setCredentials('account', 'token');

/* Send unique short and long SMS example

Response short example:
 {
    "sendSmsResponse" : {
        "statusCode" : "00",
        "statusDescription" : "Ok",
        "detailCode" : "000",
        "detailDescription" : "Message Sent"
    }
 }

Response long example:
 {
    "sendSmsResponse" : {
        "statusCode": "00",
        "statusDescription": "Ok",
        "detailCode": "000",
        "detailDescription": "Message Sent",
        "parts": [
            {
                "partId": "idteste_001",
                "order": 1
            },
            {
                "partId": "idteste_002",
                "order": 2
            },
            {
                "partId": "idteste_003",
                "order": 3
            }
        ]
    }
 }
 */
let send_sms_payload = {
    sendSmsRequest: {
        from: "Zenvia",
        to: "5551999999999",
        schedule: null,
        msg: "Hello Zenvia from NodeJS!!!",
        callbackOption: "ALL",
        id: '001',
        aggregateId: "002"
    }
};

zapi
    .sendSMS(send_sms_payload)
    .then((res)=> {
        console.log(res);
    })
    .catch((err)=> {
        console.error(err);
    });

/*
 Send multiple SMS example

 Response example:
  {
    "statusCode":200,
    "body":{
        "sendSmsMultiResponse":{
            "sendSmsResponseList":[
                {
                    "statusCode":"10",
                    "statusDescription":"Error",
                    "detailCode":"080",
                    "detailDescription":"Message with same ID already sent"
                },
                {
                    "statusCode":"10",
                    "statusDescription":"Error",
                    "detailCode":"080",
                    "detailDescription":"Message with same ID already sent"
                }
            ]
        }
    }
 }
 */
let send_multi_sms_payload = {
    sendSmsMultiRequest: {
        aggregateId: 1750,
        sendSmsRequestList: [
            {
                from: "Zenvia",
                to: "5551999999999",
                schedule: null,
                msg: "Hello Zenvia from NodeJS!!! 2",
                callbackOption: "ALL",
                id: '001'
            },
            {
                from: "Zenvia",
                to: "5551982193388",
                schedule: null,
                msg: "Hello Zenvia from NodeJS!!! 2",
                callbackOption: "ALL",
                id: '001'
            }
        ]
    }
};

zapi
    .sendSMS(send_multi_sms_payload)
    .then((res)=> {
        console.log(JSON.stringify(res));
    })
    .catch((err)=> {
        console.error(err);
    });

// TODO: create examples to getSMSStatus, getSMSReceivedList, getSMSReceivedListSearch, cancelScheduledSMS