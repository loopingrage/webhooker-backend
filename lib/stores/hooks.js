'use strict';

const firebase = require('firebase');
const Hook = require('../models/hook');

class HookStore {

  constructor() {
    firebase.initializeApp({
      serviceAccount: `${__dirname}/service-account.json`,
      databaseURL: "https://webhooker-server.firebaseio.com/"
    });
    this.db = firebase.database();
  }

  get(id) {
    return new Promise((resolve, reject) => {
      this.db.ref(`/hooks/${id}`).once('value').then((snapshot) => {
        const val = snapshot.val();
        if(val == null) {
          resolve(null);
        }
        else {
          val.id = id;
          resolve(new Hook(val));
        }
      });
    });
  }

}

module.exports = HookStore;
