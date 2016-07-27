'use strict';

var util = require('util');
var config = require('./config');
var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require("./lib/logger");

/* Initialising Express APP */
var app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(require('morgan')('combined', {stream: logger.stream}));

/* Initialising Slack Client */
var Slack = require('node-slackr');
var slack = new Slack(config.slack.webhook_url + config.slack.webhook_key,{
  channel: config.slack.channel,
  username: config.slack.username,
  icon_emoji: config.slack.emoji
});

/*
 * Main Express Process
 */
var server = app.listen(config.api.port, config.api.host, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log(config.app.name + '\n');
  console.log('host: ' + host + '\n');
  console.log('port: ' + port + '\n');
});

/* Root API Endpoint */
app.get('/', function (req, res) {
 res.send('Hi, I\'m RS monitor Slack client\n');
});

// This responds a POST request for the slack webhook
app.post('/slack/webhook/', function (req, res) {
  console.log('Got a POST request for webhook');
  // console.log(req.query.key);
  // console.log(req.headers['user-agent']);
  // console.log(req.body.details.state);
  // console.dir(req.body);

  if ('x-rackspace-webhook-token' in req.headers) {
    var rs_webhook_token = req.headers['x-rackspace-webhook-token'];
    if (config.rs.allowed_tokens.indexOf(rs_webhook_token) >= 0) {
      res.status(200).send("OK");
      var body = buildMessages(req.body);
      slack.notify(body, function(err, result) {
        logger.log('info', 'Message sent: ' + JSON.stringify(body));
      });
    }
    else { res.status(404).send("What???"); }
  }
  else { res.status(404).send("What???"); }
})

function buildMessages(payload) {
  var colour = 'good';
  switch(payload.details.state) {
    case 'OK':
      colour = 'good'
      break;
    case 'WARNING':
      colour = 'warning'
      break;
    case 'CRITICAL':
      colour = 'danger'
      break;
    default:
      colour = 'good'
  }

  var messages = {
    channel: config.slack.channel,
    username: config.slack.username,
    attachments: [
      {
        fallback: "Alert!",
        color: colour,
        fields: [
          {
            title: payload.entity.label + " - " + payload.check.label,
            value: payload.details.status,
            short: false
          },
          {
            title: "Server IP",
            value: payload.entity.ip_addresses.public0_v4,
            short: false
          }
        ],
        footer: "RS Intelligence",
        footer_icon: "http://www.rackspace.co.uk/sites/all/themes/rackspace/favicon.ico",
        ts: payload.details.timestamp / 1000
      }
    ]
  }
  return messages;
}
