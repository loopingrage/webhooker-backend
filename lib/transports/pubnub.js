'use strict';

const log = require('winston');

class PubnubTransport {

  constructor(config) {
      log.info('New transport');
      this.config = config;
      this.channelIndex = 0;
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
    const self = this;
    return new Promise((resolve, reject) => {
        const channel = this.config.channels[self.channelIndex];
        log.info("Publishing to channel", channel);
        this.pubnub.publish({
            channel: channel,
            message: payload,
                callback: function() {
                    resolve();
            },
                error: function(err) {
                reject(err);
            }
        });
        // If we're dealing with multiple channels
        if(this.config.channels.length > 1) {
            // Increment channelIndex
            log.info("Channel index was", self.channelIndex);
            self.channelIndex = self.channelIndex + 1;
            log.info("Channel index is now", self.channelIndex);
            // Reset channelIndex is we have reached the end
            if(self.channelIndex == this.config.channels.length) {
                self.channelIndex = 0;
            }
        }
    });
  }

}

module.exports = PubnubTransport;
