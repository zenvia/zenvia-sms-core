'use strict';

const expect = require('chai').expect;
const zapi = require('../index').api;

describe('API', ()=>{

    const phone_number = process.env.zenvia_phonenumber;
    const zenvia_account = process.env.zenvia_account;
    const zenvia_password = process.env.zenvia_password;

    beforeEach(()=>{
        zapi.setCredentials(zenvia_account, zenvia_password);
    });

    it('should set credentials', () => {

        zapi.setCredentials('abc', '123');

        expect(JSON.stringify(zapi.CREDENTIALS))
            .to
            .equal(
                JSON.stringify({
                    account: 'abc',
                    token: '123',
                })
            );

    });

    it('should get default headers', () => {

        expect(JSON.stringify(zapi.DEFAULT_HEADER))
            .to
            .equal(
                JSON.stringify({'Accept': 'application/json', 'Content-Type': 'application/json'})
            );

    });

    it('should get default zenvia api endpoints', () => {

        expect(JSON.stringify(zapi.ZENVIA_API))
            .to
            .equal(
                JSON.stringify({

                    api_hostname: 'https://api-rest.zenvia360.com.br',

                    post_sms_path: '/services/send-sms',
                    post_sms_multiple: '/services/send-sms-multiple',

                    get_sms_status: '/services/get-sms-status',
                    get_sms_received_list: '/services/received/list',
                    get_sms_received_list_search: '/services/received/search',

                    cancel_scheduled_sms: '/services/cancel-sms'

                })
            );

    });


    it('should exist sendSMS function', () => {

        let f_name = zapi.sendSMS.name;

        expect(f_name)
            .to
            .equal('sendSMS');

    });

    it('should exist getSMSStatus function', () => {

        let f_name = zapi.getSMSStatus.name;

        expect(f_name)
            .to
            .equal('getSMSStatus');

    });

    it('should exist getSMSReceivedList function', () => {

        let f_name = zapi.getSMSReceivedList.name;

        expect(f_name)
            .to
            .equal('getSMSReceivedList');

    });

    it('should exist getSMSReceivedListSearch function', () => {

        let f_name = zapi.getSMSReceivedListSearch.name;

        expect(f_name)
            .to
            .equal('getSMSReceivedListSearch');

    });

    it('should exist cancelScheduledSMS function', () => {

        let f_name = zapi.cancelScheduledSMS.name;

        expect(f_name)
            .to
            .equal('cancelScheduledSMS');

    });


    it('should sendSMS function return catch 401', (done) => {

        zapi.setCredentials('abc', '123');

        zapi
            .sendSMS({})
            .then((res)=>{})
            .catch((err)=>{

                expect(JSON.stringify(err))
                    .to
                    .equal(JSON.stringify({ statusCode: 401, body: 'Bad credentials' }));

                done();

            })
            .catch(err => {



            })

    }).timeout(10000);

    // TODO: refactor this
    it('should getSMSStatus function return catch 401', (done) => {

        zapi.setCredentials('abc', '123');

        zapi
            .getSMSStatus(0)
            .then((res)=>{})
            .catch((err)=>{

                expect(JSON.stringify(err))
                    .to
                    .equal(JSON.stringify({"statusCode":400,"body":{"exception":{"message":"Cannot consume content type"}}}));

                done();

            });

    }).timeout(10000);

    it('should getSMSReceivedList function return catch 401', (done) => {

        zapi.setCredentials('abc', '123');

        zapi
            .getSMSReceivedList()
            .then((res)=>{})
            .catch((err)=>{

                expect(JSON.stringify(err))
                    .to
                    .equal(JSON.stringify({ statusCode: 401, body: 'Bad credentials' }));

                done();

            });

    }).timeout(10000);

    it('should getSMSReceivedListSearch function return catch 401', (done) => {

        zapi.setCredentials('abc', '123');

        zapi
            .getSMSReceivedListSearch(Date.now(), Date.now())
            .then((res)=>{})
            .catch((err)=>{

                expect(JSON.stringify(err))
                    .to
                    .equal(JSON.stringify({ statusCode: 401, body: 'Bad credentials' }));

                done();

            });

    }).timeout(10000);

    it('should cancelScheduledSMS function return catch 401', (done) => {

        zapi.setCredentials('abc', '123');

        zapi
            .cancelScheduledSMS(Date.now(), Date.now())
            .then((res)=>{})
            .catch((err)=>{

                expect(JSON.stringify(err))
                    .to
                    .equal(JSON.stringify({ statusCode: 401, body: 'Bad credentials' }));

                done();

            });

    }).timeout(10000);


    it('should sendSMS function return success', (done) => {

        const payload = {
            sendSmsRequest: {
                from: "Zenvia API",
                to: phone_number,
                schedule: null,
                msg: "Hello from Zenvia API from NodeJS!!!",
                callbackOption: "NONE",
                id: parseInt(Math.random() * 10000).toString(),
                aggregateId: "777"
            }
        };

        zapi
            .sendSMS(payload)
            .then((res)=> {

                expect(JSON.stringify(res))
                    .to.equal(JSON.stringify({
                        statusCode: 200,
                        body: {
                            sendSmsResponse: {
                                statusCode: '00',
                                statusDescription: 'Ok',
                                detailCode: '000',
                                detailDescription: 'Message Sent'
                            }
                        }
                    }
                ));

                done();

            });

    }).timeout(10000);

    it('should cancelScheduledSMS function return success', (done) => {

        const sms_id = parseInt(Math.random() * 10000).toString();

        const payload = {
            sendSmsRequest: {
                from: "Zenvia API",
                to: phone_number,
                schedule: Date.now(),
                msg: "Hello from Zenvia API from NodeJS!!!",
                callbackOption: "NONE",
                id: sms_id,
                aggregateId: "777"
            }
        };

        zapi
            .sendSMS(payload)
            .then((res) => {

                zapi
                    .cancelScheduledSMS(sms_id)
                    .then((res) => {

                        expect(JSON.stringify(res))
                            .to.equal(JSON.stringify({
                                statusCode: 200,
                                body: {
                                    cancelSmsResp: {
                                        statusCode: '09',
                                        statusDescription: 'Blocked',
                                        detailCode: '002',
                                        detailDescription: 'Message successfully canceled'
                                    }
                                }
                            }
                        ));

                        done();

                    });

            });

    }).timeout(10000);

    // TODO: make success tests for getSMSReceivedList and getSMSReceivedListSearch

});