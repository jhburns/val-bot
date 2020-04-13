[![Build Status](https://travis-ci.org/jhburns/val-bot.svg?branch=master)](https://travis-ci.org/jhburns/val-bot)

# Valerie Bot 
A simple but fun discord bot.

## About

Has multiple commands to enrich your discord server, see all with `!halp`

Add :: https://discordapp.com/oauth2/authorize?&client_id=473280648782675978&scope=bot&permissions=3247104



## Features
This bot is a pretty in depth template with some great features:
- Continuous deployment, by untiling a glitch packages
- Up to date, we use the latest (2018-08-19) version of the discord api
- Automation makes developing painless

For a tutorial on how to set up this bot of one similar see DOCS.md

## Running Server

Simply run the command `npm start`

```
info: Endpoints started on port: 3000
info: Connected
info: Valerie Bot - userID (473280648782675978)
info: Run Instance ID: (706557) Up in: 1.254sec
info: Running in: production mode
info: All quotes loaded in: 3.082sec
````

Use `npm run draft` to create new commands while a production instance is already running.
Additionally, adding the args `npm run map -- 'realName->remapName'` lets you treat an existing command
as if 'draft' is true, under a remapping name. These make it easy to run the bot in the same server as production.
 
