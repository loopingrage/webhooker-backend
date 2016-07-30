'use strict';

const log = require('winston');

class PubnubTransport {

  constructor(config) {
      this.config = config;
      this.pubnub = require("pubnub")({
          ssl: true,
          publish_key: config.publishKey,
          subscribe_key: config.subscribeKey,
          error: function (error) {
              log.error('PubNub Transport:', error);
          }
      });
  }

  publish(payload) {
    const _this = this;
    return new Promise(function(resolve, reject) {
      _this.pubnub.publish({
          channel: _this.config.channel,
          message: payload,
          callback: function() {
            resolve();
          },
          error: function(err) {
            reject(err);
          }
      });
    });
  }

}

module.exports = PubnubTransport;
