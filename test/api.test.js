'use strict';

require('dotenv').config()

const use_zenvia_apis_mock = true;
const expect = require('chai').expect;
const zapi = require('../index').api;

describe('API', () => {

  const smsId = 0;
  const timeout = 15000;
  const hostName = 'https://zenvia-apis-mock.herokuapp.com/api-rest';
  const phoneNumber = '5551999999200';
  const zenviaAccount = 'user';
  const zenviaPassword = 'pass';

  if (!use_zenvia_apis_mock) {
    smsId = parseInt(Math.random() * 10000).toString();
    timeout = 10000; 
    hostName = 'https://api-rest.zenvia360.com.br';
    phoneNumber = process.env.ZENVIA_PHONENUMBER;
    zenviaAccount = process.env.ZENVIA_ACCOUNT;
    zenviaPassword = process.env.ZENVIA_PASSWORD;
  }

  beforeEach(() => {
    zapi.setCredentials(zenviaAccount, zenviaPassword);
    zapi.setHostName(hostName);
  });

  it('should set credentials', () => {
    zapi.setCredentials('abc', '123');
    expect(JSON.stringify(zapi.CREDENTIALS))
            .to
            .equal(
                JSON.stringify({
                  account: 'abc',
                  password: '123',
                })
            );
  });

  it('should get default headers', () => {
    expect(JSON.stringify(zapi.DEFAULT_HEADER))
            .to
            .equal(
                JSON.stringify({ Accept: 'application/json', 'Content-Type': 'application/json' })
            );
  });

  it('should get default zenvia api endpoints', () => {
    expect(JSON.stringify(zapi.ZENVIA_API))
            .to
            .equal(
                JSON.stringify({
                  apiHostName: hostName,
                  postSmsPath: '/services/send-sms',
                  postSmsMultiple: '/services/send-sms-multiple',
                  getSmsStatus: '/services/get-sms-status',
                  getSmsReceivedList: '/services/received/list',
                  getSmsReceivedListSearch: '/services/received/search',
                  cancelScheduledSms: '/services/cancel-sms',

                })
            );
  });

  it('should exist sendSMS function', () => {
    expect(zapi.sendSMS.name).to.equal('sendSMS');
  });

  it('should exist getSMSStatus function', () => {
    expect(zapi.getSMSStatus.name).to.equal('getSMSStatus');
  });

  it('should exist getSMSReceivedList function', () => {
    expect(zapi.getSMSReceivedList.name).to.equal('getSMSReceivedList');
  });

  it('should exist getSMSReceivedListSearch function', () => {
    expect(zapi.getSMSReceivedListSearch.name).to.equal('getSMSReceivedListSearch');
  });

  it('should exist cancelScheduledSMS function', () => {
    expect(zapi.cancelScheduledSMS.name).to.equal('cancelScheduledSMS');
  });

  it('should sendSMS function return success', (done) => {
    const payload = {
      sendSmsRequest: {
        from: 'Zenvia API',
        to: phoneNumber,
        schedule: '2017-08-09T14:00:00',
        msg: 'Hello from Zenvia API from NodeJS!!!',
        callbackOption: 'NONE',
        id: parseInt(Math.random() * 10000).toString(),
        aggregateId: '777',
      },
    };

    zapi.sendSMS(payload)
        .then((res) => {
          expect(JSON.stringify(res))
                .to.equal(JSON.stringify({
                  statusCode: 200,
                  body: {
                    sendSmsResponse: {
                      statusCode: '00',
                      statusDescription: 'Ok',
                      detailCode: '000',
                      detailDescription: 'Message Sent',
                    },
                  },
                }
            ));

          done();
        })
        .catch((err) => {
          console.log(err, "sendSMS Simple SMS");
          done();
        });
  }).timeout(timeout);


  it('should sendSMS(Flash Msg) function return success', (done) => {
    const payload = {
      sendSmsRequest: {
        from: 'Zenvia API',
        to: phoneNumber,
        schedule: '2017-08-09T14:00:00',
        msg: 'Hello from Zenvia API from NodeJS - Flash Msg',
        callbackOption: 'NONE',
        id: parseInt(Math.random() * 10000).toString(),
        aggregateId: 777,
        flashSms: true
      }
    };

    zapi.sendSMS(payload)
        .then((res) => {
          const response = res.body.sendSmsResponse;
          expect(res.statusCode).to.equal(200);
          expect(response.statusCode).to.equal('00');
          expect(response.statusDescription).to.equal('Ok');
          expect(response.detailCode).to.equal('000');
          expect(response.detailDescription).to.equal('Message Sent');
          done();
        })
        .catch((err) => {
          console.log(err, 'sendSMS Simple(Flash Msg) - SMS');
          done();
        });
  }).timeout(timeout);

  it('should sendSMS Multiple(Flash Msg) function return success', (done) => {
    const payload = {
      sendSmsMultiRequest: {
        aggregateId: 777,
        sendSmsRequestList: [{
          from: 'remetente',
          to: phoneNumber,
          msg: 'Hello from Zenvia API from NodeJS - Flash Msg Multiple',
          callbackOption: 'NONE',
          flashSms: true,
          schedule: '2017-08-09T14:00:00',
          id: parseInt(Math.random() * 10000).toString()
        }]
      }
    };

    zapi.sendSMS(payload)
        .then((res) => {
          const response = res.body.sendSmsMultiResponse.sendSmsResponseList[0];
          expect(res.statusCode).to.equal(200);
          expect(response.statusCode).to.equal('00');
          expect(response.statusDescription).to.equal('Ok');
          expect(response.detailCode).to.equal('000');
          expect(response.detailDescription).to.equal('Message Sent');
          done();
         })
       .catch((err) => {
          console.log(res, "sendSMS Multiple(Flash Msg)")
          done();
        });
  }).timeout(timeout);

  it('should sendSMS function return catch 401', (done) => {
    const payload = {
      sendSmsRequest: {
        from: 'Zenvia API',
        to: phoneNumber,
        schedule: '2017-08-09T14:00:00',
        msg: 'Hello from Zenvia API from NodeJS - Flash Msg',
        callbackOption: 'NONE',
        id: parseInt(Math.random() * 10000).toString(),
        aggregateId: 777,
        flashSms: true
      }
    };

    // Setting invalid credentials
    zapi.setCredentials('abc', '123');
    zapi.sendSMS(payload)
        .then((res) => {})
        .catch((err) => {
          expect(JSON.stringify(err))
                .to
                .equal(JSON.stringify({ statusCode: 401, body: 'Bad credentials' }));

          done();
        })
        .catch(err => {
          console.log(res, "sendSMS function return catch 401")
          done();
        });
  }).timeout(timeout);

  it('should getSMSStatus function return catch 401', (done) => {
    zapi.setCredentials('abc', '123');
    zapi.getSMSStatus(smsId)
        .then((res) => {})
        .catch((err) => {
          expect(JSON.stringify(err))
                .to
                .equal(JSON.stringify({ statusCode: 401, body: 'Bad credentials' }));
          done();
        });
  }).timeout(timeout);

  it('should getSMSStatus function return success', (done) => { 
    zapi.getSMSStatus(smsId)
        .then((res) => {
          expect(JSON.stringify(res))
                .to.equal(JSON.stringify({
                  statusCode: 200,
                  body: {
                    getSmsStatusResp: {
                      id: '0',
                      received: '2017-08-20T18:56:57',
                      shortcode: null,
                      mobileOperatorName: 'vivo',
                      statusCode: '02',
                      statusDescription: 'Sent',
                      detailCode: '133',
                      detailDescription: 'Message content in analysis' 
                    },
                  },
                }
            ));

          done();
        })
        .catch((err) => {
          console.log(err, "getSMSStatus function return success");
          done();
        });
  }).timeout(timeout);

  it('should cancelScheduledSMS function return success', (done) => {
      zapi.cancelScheduledSMS(smsId)
          .then(res => {
            const response = res.body.cancelSmsResp;
            expect(res.statusCode).to.equal(200);
            expect(response.statusCode).to.equal('09');
            expect(response.statusDescription).to.equal('Blocked');
            expect(response.detailCode).to.equal('002');
            expect(response.detailDescription).to.equal('Message successfully canceled');
            done();
          })
        .catch(err => {
          done();
          console.log(err, "cancelScheduledSMS");
        });
  }).timeout(timeout);

/*
  it('should getSMSReceivedList function return catch 401', (done) => {
    zapi.setCredentials('abc', '123');
    zapi.getSMSReceivedList()
        .then((res) => {})
        .catch((err) => {
          expect(JSON.stringify(err))
                .to
                .equal(JSON.stringify({ statusCode: 401, body: 'Bad credentials' }));

          done();
        });
  }).timeout(10000);

  it('should getSMSReceivedListSearch function return catch 401', (done) => {
    zapi.setCredentials('abc', '123');
    zapi.getSMSReceivedListSearch(Date.now(), Date.now())
        .then((res) => {})
        .catch((err) => {
          expect(JSON.stringify(err))
                .to
                .equal(JSON.stringify({ statusCode: 401, body: 'Bad credentials' }));

          done();
        });
  }).timeout(10000);

  it('should cancelScheduledSMS function return catch 401', (done) => {
    zapi.setCredentials('abc', '123');
    zapi.cancelScheduledSMS(Date.now(), Date.now())
        .then((res) => {})
        .catch((err) => {
          expect(JSON.stringify(err))
                .to
                .equal(JSON.stringify({ statusCode: 401, body: 'Bad credentials' }));

          done();
        });
  }).timeout(10000);
  */
});
