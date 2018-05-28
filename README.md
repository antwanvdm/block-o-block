# Block-o-Block game

## What is this game about?
This game is mainly about getting more knowledge about typescript and
building a game around it. The base idea is to give users a simple circle
which can catch blocks by using your arrow keys. Each level results in
having more blocks on your screen with the same time available per level.
Your will always be able to only play X amount of levels, which results
in a total score at the end of your game.

## Why did I start this?
Pretty ease, my students are working on a Typescript game as we speak,
and I wanted to make sure I mastered the basics. After 1 day my ambitions
grew and this game will probably get way bigger than ever intended...

## How to get it running?
1. Install typescript with `npm install -g typescript`
2. Make sure latest versions of node (8.11.2) and npm (5.6.0) are installed
3. Run `npm install` for the right tools
4. Run `npm run watch` in the root folder
5. Have a web server running with the `/docs` folder as root folder
6. Add the `dev/config.json` file as it isn't part of the git code. Contents
should look like the following code. You can set the first `dataService` to 
`false` if configuring mLabs api takes way too much time :-)
```
{
  "functionalities": {
    "dataService": true
  },
  "dataService": {
    "baseUrl": "https://api.mlab.com/api/1",
    "apiKey": "",
    "databaseName": "",
    "collectionName": ""
  }
}
```

## Road map
* ~~Structure the code better. I've started with the simplest setup, but
off course it needs modules/webpack and a more logical folder structure.~~
* ~~Better styling with some CSS framework~~
* More interaction in the levels to have a more dynamic feeling, I guess
the game could get boring now :-)
* ~~Store scores~~ and show a high score list
* Maybe translate the DOM element to Canvas elements, because it will
probably perform better in the end
