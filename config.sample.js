var config = {};

config.app = {};
config.api = {};
config.slack = {};
config.rs = {};

/* App Settings */
config.app.name = "RS monitor";

/* API Settings */
config.api.port = 3999;
config.api.host = '127.0.0.1';

/* Slack WebHook Settings */
config.slack.username = "";
config.slack.emoji = ":robot_face:";
config.slack.channel = "";
config.slack.webhook_url = "https://hooks.slack.com/services/";
config.slack.webhook_key = "";
config.slack.eventColor = "good"; // can either be one of good, warning, danger, or any hex color code (eg. #439FE0).

/* Rackspace tokens */
config.rs.allowed_tokens = [];

/* Do Not edit the following code */
module.exports = config;
