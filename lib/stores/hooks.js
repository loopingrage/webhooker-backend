'use strict';

const config = require('config').get('hookStore');
const cacheManager = require('cache-manager');
const cache = cacheManager.caching({store: 'memory', max: 100, ttl: 3600});

const firebase = require('firebase');
const Hook = require('../models/hook');

class HookStore {

  constructor() {
    firebase.initializeApp({
      serviceAccount: config.serviceAccount,
      databaseURL: config.databaseURL
    });
    this.db = firebase.database();
  }

  get(id) {
    return cache.wrap(id, () => {
      return new Promise((resolve, reject) => {
        this.db.ref(`/hooks/${id}`).once('value').then((snapshot) => {
          let hook = null;
          const val = snapshot.val();
          if(val != null) {
            val.id = id;
            hook = new Hook(val);
          }
          resolve(hook);
        });
      });
    });
  }

}

module.exports = HookStore;
