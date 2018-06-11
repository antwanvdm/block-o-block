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

## Live demo
Thanks to the wonderful feature 'Github live pages' you can check the live
demo here: [Check it out!](https://antwanvdm.github.io/block-o-block/)

## How to get it running?
1. Install typescript with `npm install -g typescript`
2. Make sure latest versions of node (8.11.2) and npm (5.6.0) are installed
3. Run `npm install` for the right tools
4. Run `npm run watch` in the root folder
5. Have a web server running with the `/docs` folder as root folder
6. Add the `dev/config.json` file as it isn't part of the git code. Contents
should look like the following code. You can set the `mLab` property to 
`false` if configuring the mLab api takes way too much time :-)
```
{
  "game": {
    "levelsPerGame": 10,
    "startElementsPerLevel": 5,
    "elementsIncreasePerLevel": 5,
    "scorePerElement": 10,
    "secondsPerLevel": 10,
    "blockSpeed": {
      "min": 1,
      "max": 5
    },
    "blockPixels": {
      "min": 10,
      "max": 250
    },
    "player": {
      "growthFactor": 1.5,
      "speed": 2,
      "speedIncreaseFactor": 0.2
    }
  },
  "functionalities": {
    "mLab": true
  },
  "mLab": {
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
* ~~Store scores and show a high score list~~
* ~~Update the high score logic with local storage~~
* Enter your name for the high score and show your personal best score
* More interaction in the levels to have a more dynamic feeling, I guess
the game could get boring now :-)
* Maybe translate the DOM element to Canvas elements, because it will
probably perform better in the end
