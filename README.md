# rsmbot
Rackspace Monitor Slack BOT

##Summary
A Slack BOT written in Node.js that sends RackSpace monitor alerts to a [Slack](https://slack.com/) channel.
It accepts POSTs from Racspace intelligence and send a message to a Slack webhook

### File structure
```
rsmbot/
├── config.js (config file)
├── config.sample.js (config sample file)
├── index.js (main NodeJS file)
├── lib
│   └── logger.js (logger helper)
├── package.json
└── README.md
```

### Setup

    npm install

### Add the config file

    cp config.sample.js config.js
    nano config.js

### Start the app

	node index.js
