'use strict';

class Hook {

  constructor(config) {
    this.id = config.id;
    this.type = config.type;
    this.config = config.config;
  }

  publish(payload) {
    if(!this.transport) {
      switch(this.type) {
        case 'pubnub':
          const PubnubTransport = require('../transports/pubnub');
          this.transport = new PubnubTransport(this.config);
          break;
        case 'sqs':
          const SqsTransport = require('../transports/sqs');
          this.transport = new SqsTransport(this.config);
          break;
      }
    }
    return this.transport.publish(payload);
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      config: this.config
    }
  }

}

module.exports = Hook;
