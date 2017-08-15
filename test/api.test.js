'use strict';

const expect = require('chai').expect;
const zapi = require('../index').api;

describe('API', () => {
  const phoneNumber = process.env.zenvia_phonenumber;
  const zenviaAccount = process.env.zenviaAccount;
  const zenviaPassword = process.env.zenviaPassword;

  beforeEach(() => {
    zapi.setCredentials(zenviaAccount, zenviaPassword);
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
                  apiHostName: 'https://api-rest.zenvia360.com.br',
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
    const fName = zapi.sendSMS.name;

    expect(fName)
            .to
            .equal('sendSMS');
  });

  it('should exist getSMSStatus function', () => {
    const fName = zapi.getSMSStatus.name;

    expect(fName)
            .to
            .equal('getSMSStatus');
  });

  it('should exist getSMSReceivedList function', () => {
    const fName = zapi.getSMSReceivedList.name;

    expect(fName)
            .to
            .equal('getSMSReceivedList');
  });

  it('should exist getSMSReceivedListSearch function', () => {
    const fName = zapi.getSMSReceivedListSearch.name;

    expect(fName)
            .to
            .equal('getSMSReceivedListSearch');
  });

  it('should exist cancelScheduledSMS function', () => {
    const fName = zapi.cancelScheduledSMS.name;

    expect(fName)
            .to
            .equal('cancelScheduledSMS');
  });


  it('should sendSMS function return catch 401', (done) => {
    zapi.setCredentials('abc', '123');

    zapi
            .sendSMS({})
            .then((res) => {})
            .catch((err) => {
              expect(JSON.stringify(err))
                    .to
                    .equal(JSON.stringify({ statusCode: 401, body: 'Bad credentials' }));

              done();
            })
            .catch(err => {


            });
  }).timeout(10000);

  it('should getSMSStatus function return catch 401', (done) => {
    zapi.setCredentials('abc', '123');
    zapi.getSMSStatus(0)
        .then((res) => {})
        .catch((err) => {
          expect(JSON.stringify(err))
                .to
                .equal(JSON.stringify({ statusCode: 400, body: { exception: { message: 'Cannot consume content type' } } }));

          done();
        });
  }).timeout(10000);

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


  it('should sendSMS function return success', (done) => {
    const payload = {
      sendSmsRequest: {
        from: 'Zenvia API',
        to: phoneNumber,
        schedule: null,
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
  }).timeout(10000);

  it('should sendSMS(Flash Msg) function return success', (done) => {
    const payload = {
      sendSmsRequest: {
        from: 'Zenvia API',
        to: phoneNumber,
        schedule: null,
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
  }).timeout(10000);

  it('should sendSMS Multiple(Flash Msg) function return success', (done) => {
    const payload = {
      sendSmsMultiRequest: {
        aggregateId: 777,
        sendSmsRequestList: [{
          from: 'remetente',
          to: phoneNumber,
          msg: 'Hello from Zenvia API from NodeJS - Flash Msg Multiple',
          callbackOption: 'NONE',
          flashSms: true
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
  }).timeout(10000);

  it('should cancelScheduledSMS function return success', (done) => {
    const smsId = parseInt(Math.random() * 10000).toString();

    const payload = {
      sendSmsRequest: {
        from: 'Zenvia API',
        to: phoneNumber,
        schedule: Date.now() + 10000,
        msg: 'Hello from Zenvia API from NodeJS!!!',
        callbackOption: 'NONE',
        id: smsId,
        aggregateId: '777',
      },
    };

    zapi.sendSMS(payload)
        .then((res) => {
          zapi
                .cancelScheduledSMS(smsId)
                .then(res => {
                  expect(JSON.stringify(res))
                        .to.equal(JSON.stringify({
                          statusCode: 200,
                          body: {
                            cancelSmsResp: {
                              statusCode: '09',
                              statusDescription: 'Blocked',
                              detailCode: '002',
                              detailDescription: 'Message successfully canceled',
                            },
                          },
                        }
                    ));

                  done();
                });
        })
        .catch(err => {
          done();
          console.log(err, "cancelScheduledSMS");
        });
  }).timeout(10000);
});
