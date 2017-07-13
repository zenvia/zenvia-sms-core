#!/usr/bin/env node
'use strict';

/**
 * Zenvia SMS API
 *
 * Functions:
 *      setCredentials(account, token) - Set API Credentials
 *      sendSMS(payload) - Send unique and multiple SMS
 *      getSMSStatus(sms_id) - Get SMS status by ID
 *      getSMSReceivedList() - Get received SMS list
 *      getSMSReceivedListSearch(start_date, end_date) - Get received SMS list filtered by start and end date
 *      cancelScheduledSMS(sms_id) - Cancel scheduled SMS by id
 *
 * @author Jonatas Freitas <jonatasfreitasv@gmail.com> (https://github.com/jonatasfreitasv)
 * @license MIT
 */

const unirest = require('unirest');

module.exports = {

    ZENVIA_API: {

        api_hostname: 'https://api-rest.zenvia360.com.br',

        post_sms_path: '/services/send-sms',
        post_sms_multiple: '/services/send-sms-multiple',

        get_sms_status: '/services/get-sms-status',
        get_sms_received_list: '/services/received/list',
        get_sms_received_list_search: '/services/received/search',

        cancel_scheduled_sms: '/services/cancel-sms'

    },

    DEFAULT_HEADER: {'Accept': 'application/json', 'Content-Type': 'application/json'},

    CREDENTIALS: {
        account: null,
        token: null,
    },

    setCredentials(account, token){
        this.CREDENTIALS.account = account;
        this.CREDENTIALS.token = token;
    },

    sendSMS(payload){

        return new Promise((resolve, reject)=> {

            const path = payload.sendSmsMultiRequest ?
                this.ZENVIA_API.post_sms_multiple : this.ZENVIA_API.post_sms_path;

            const url = this.ZENVIA_API.api_hostname + path;

            unirest
                .post(url)
                .headers(this.DEFAULT_HEADER)
                .send(payload)
                .auth({
                    user: this.CREDENTIALS.account,
                    pass: this.CREDENTIALS.token
                })
                .end(function (response) {

                    const res = {
                        statusCode: response.status,
                        body: response.status !== 401 ? response.body : 'Bad credentials'
                    };

                    response.status === 200 ? resolve(res) : reject(res);

                });

        }, payload);

    },

    // TODO: Not working
    getSMSStatus(sms_id){

        return new Promise((resolve, reject)=>{

            const url = `${this.ZENVIA_API.api_hostname}${this.ZENVIA_API.get_sms_status}/${sms_id}`;

            unirest
                .get(url)
                .headers({'Accept': 'application/octet-stream', 'Content-Type': 'application/octet-stream'})
                .auth({
                    user: this.CREDENTIALS.account,
                    pass: this.CREDENTIALS.token
                })
                .end(function (response) {

                    const res = {
                        statusCode: response.status,
                        body: response.status !== 401 ? response.body : 'Bad credentials'
                    };

                    response.status === 200 ? resolve(res) : reject(res);

                });

        }, sms_id);

    },

    // TODO: Not working
    getSMSReceivedList(){

        return new Promise((resolve, reject)=> {

            const url = this.ZENVIA_API.api_hostname + this.ZENVIA_API.get_sms_received_list;

            unirest
                .post(url)
                .headers(this.DEFAULT_HEADER)
                .auth({
                    user: this.CREDENTIALS.account,
                    pass: this.CREDENTIALS.token
                })
                .end(function (response) {

                    const res = {
                        statusCode: response.status,
                        body: response.status !== 401 ? response.body : 'Bad credentials'
                    };

                    response.status === 200 ? resolve(res) : reject(res);

                });

        });

    },

    // TODO: Not working
    getSMSReceivedListSearch(start_date, end_date){

        return new Promise((resolve, reject)=> {

            const url = `${this.ZENVIA_API.api_hostname}${this.ZENVIA_API.get_sms_received_list_search}/${start_date}/${end_date}`;

            unirest
                .get(url)
                .headers(this.DEFAULT_HEADER)
                .auth({
                    user: this.CREDENTIALS.account,
                    pass: this.CREDENTIALS.token
                })
                .end(function (response) {

                    const res = {
                        statusCode: response.status,
                        body: response.status !== 401 ? response.body : 'Bad credentials'
                    };

                    response.status === 200 ? resolve(res) : reject(res);

                });

        });

    },

    cancelScheduledSMS(sms_id){

        return new Promise((resolve, reject)=> {

            const url = `${this.ZENVIA_API.api_hostname}${this.ZENVIA_API.cancel_scheduled_sms}/${sms_id}`;

            unirest
                .post(url)
                .headers(this.DEFAULT_HEADER)
                .auth({
                    user: this.CREDENTIALS.account,
                    pass: this.CREDENTIALS.token
                })
                .end(function (response) {

                    const res = {
                        statusCode: response.status,
                        body: response.status !== 401 ? response.body : 'Bad credentials'
                    };

                    response.status === 200 ? resolve(res) : reject(res);

                });

        });

    },

};