#!/usr/bin/env node

/**
 * Zenvia SMS API
 *
 * Functions:
 *      setCredentials(account, password) - Set API Credentials
 *      sendSMS(payload) - Send unique and multiple SMS
 *      getSMSStatus(smsId) - Get SMS status by ID
 *      getSMSReceivedList() - Get received SMS list
 *      getSMSReceivedListSearch(startDate, endDate)
 *        - Get received SMS list filtered by start and end date
 *      cancelScheduledSMS(smsId) - Cancel scheduled SMS by id
 *
 * @author Jonatas Freitas <jonatasfreitasv@gmail.com> (https://github.com/jonatasfreitasv)
 * @license MIT
 */

const unirest = require('unirest');

module.exports = {
  ZENVIA_API: {
    apiHostName: 'https://api-rest.zenvia.com',
    postSmsPath: '/services/send-sms',
    postSmsMultiple: '/services/send-sms-multiple',
    getSmsStatus: '/services/get-sms-status',
    getSmsReceivedList: '/services/received/list',
    getSmsReceivedListSearch: '/services/received/search',
    cancelScheduledSms: '/services/cancel-sms',
  },

  DEFAULT_HEADER: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },

  CREDENTIALS: {
    account: null,
    password: null,
  },

  makeGet(url) {
    return new Promise((resolve, reject) => {
      unirest
        .get(url)
        .headers({
          Accept: 'application/octet-stream',
          'Content-Type': 'application/octet-stream',
        })
        .auth({
          user: this.CREDENTIALS.account,
          pass: this.CREDENTIALS.password,
        })
        .end((response) => {
          const res = {
            statusCode: response.status,
            body: response.status !== 401 ? response.body : 'Bad credentials',
          };

          if (response.status === 200) {
            resolve(res);
          } else {
            reject(res);
          }
        });
    });
  },

  makePost(url, payload = null) {
    return new Promise((resolve, reject) => {
      unirest
        .post(url)
        .headers(this.DEFAULT_HEADER)
        .send(payload)
        .auth({
          user: this.CREDENTIALS.account,
          pass: this.CREDENTIALS.password,
        })
        .end((response) => {
          const res = {
            statusCode: response.status,
            body: response.status !== 401 ? response.body : 'Bad credentials',
          };

          if (response.status === 200) {
            resolve(res);
          } else {
            reject(res);
          }
        });
    });
  },

  setCredentials(account, password) {
    this.CREDENTIALS.account = account;
    this.CREDENTIALS.password = password;
  },

  sendSMS(payload) {
    return new Promise((resolve, reject) => {
      const path = payload.sendSmsMultiRequest
        ? this.ZENVIA_API.postSmsMultiple
        : this.ZENVIA_API.postSmsPath;

      const url = this.ZENVIA_API.apiHostName + path;

      this.makePost(url, payload)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    }, payload);
  },

  // TODO: Not working
  getSMSStatus(smsId) {
    return new Promise((resolve, reject) => {
      const url = `${this.ZENVIA_API.apiHostName}${this.ZENVIA_API.getSmsStatus}/${smsId}`;

      this.makeGet(url)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    }, smsId);
  },

  // TODO: Not working
  getSMSReceivedList() {
    return new Promise((resolve, reject) => {
      const url =
        this.ZENVIA_API.apiHostName + this.ZENVIA_API.getSmsReceivedList;

      this.makePost(url)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },

  // TODO: Not working
  getSMSReceivedListSearch(startDate, endDate) {
    return new Promise((resolve, reject) => {
      const url = `${this.ZENVIA_API.apiHostName}${this.ZENVIA_API.getSmsReceivedListSearch}/${startDate}/${endDate}`;

      this.makeGet(url)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },

  cancelScheduledSMS(smsId) {
    return new Promise((resolve, reject) => {
      const url = `${this.ZENVIA_API.apiHostName}${this.ZENVIA_API.cancelScheduledSms}/${smsId}`;

      this.makePost(url)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
};
