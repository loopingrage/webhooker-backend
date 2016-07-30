'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const store = new (require('../stores/hooks'))();
const log = require('winston');

module.exports = function () {

  var router = express.Router();

  // Parse JSON and load raw content
  router.use(bodyParser.json({
    verify: (req, res, buf, encoding) => {
      req.rawBody = buf.toString('utf8');
    }
  }));

  router.post('/:hookId', (req, res) => {

    const hookId = req.params.hookId;

    log.info('Got POST', {hookId});

    store.get(hookId).then(hook => {

      if(hook == null) {
        log.error('Hook not found');
        res.sendStatus(404);
        return;
      }

      const headers = {}
      Object.keys(req.headers).forEach(key => {
        //if(!key.startsWith('x-')) {
          headers[key] = req.headers[key];
        //}
      });

      const payload = {
        method: req.method,
        headers: headers,
        body: req.rawBody
      };

      hook.publish(payload).then(() => {
        log.info('Published payload', {hookId});
        res.sendStatus(200);
      }).catch(err => {
        log.error('Failed to publish payload', err, {hookId});
        res.sendStatus(500);
      });

    }).catch(err => {
      log.error('Failed to publish payload', err, {hookId});
      res.sendStatus(500);
    });

    req.on

  });

  return router;
};
