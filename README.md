This project will be an online browser game (when it's finished).

A game based on the following logic and rules:

- type of the game: text + sound, round based, one player against all other, changes every round
- game logic: first player chooses one from 3 sentences, must read it into his mic in reverse (e.g "hello friends" should be read as "sdneirf olleh").
  audio will be reversed and uploaded to the server. other players can hear the file one time and then have to guess.
  if no one is right, they guess a second round. 3 guessing rounds, if no one guesses it, no point is given. the player(s) guessing the right sentence
  get a point. the current reader chooses the right/wrong answers of the others.
- structure:
  - **NodeJS** api-backend with **MySQL DB**
  - fixed amount of game rooms
  - **reCaptcha** on room join, to minimize spam
  - rooms can be locked (no additional player can join OR with a password)
  - DONE: audio with **html5**/**webAudio**
  - WIP: front end with **react**
  - **Websocket** for chat
  - **Websocket** for game events, serversided controlled
