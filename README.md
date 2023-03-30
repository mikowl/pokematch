# Pokematch

An overengineered pokemon memory match game you can play [here](https://pokematch.vercel.app/)

There are 9 "levels" progressing through each pokemon generation, every round is unique, at the end of the round you are shown which pokemon you caught and will have a chance to choose which would win in a battle. If you choose the correct one you will be given a random powerup which could be:
  - reveal power (temporarily reveals all the cards)
  - turn power (takes away 2 turns)
  - time power (takes 7 seconds off the clock)

**Note the battle winner is based off the sum of the pokemons stats*

![Pokematch](https://raw.githubusercontent.com/mikowl/pokematch/main/screenshots.png)

**MVP:**
  - ~~Create function that grabs 8 random pokemon from pokeapi~~
  - ~~Take the 8, double them, then shuffle~~
  - ~~Display in nice 4x4 grid~~
  - ~~Flip animation and matching logic~~
  - ~~Keep track of guesses~~
  - ~~Confetti when you win~~
  - ~~Restart game and generate new set of random pokemons~~

**TODO maybe**
  - ~~Next game will move on to next pokemon generation~~
  - ~~Different card backings per generation~~
  - ~~Sounds~~
  - ~~Different difficulties~~
  - ~~Mute button~~
  - ~~End game screen for passing gen 9~~
  - ~~Local storage to save current level and mute state~~
  - ~~Powerups~~
  - ~~Since introducing the pokemon battle after round we can probably get rid of the "Next" game button and instead progress to the next round after choosing, I think this will be a better ux~~
  - Improve "game over" screen

**Powerup ideas**
  - ~~Time freeze/minus seconds~~
  - Double points
  - ~~Free turns (take away 2 turns)~~
  - Hint (flip over one matching pair)
  - Skip level (would be rare)

