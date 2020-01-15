# ClusterioAutoPause
Add auto-pause functionality to Clusterio for Factorio. This is meant to
emulate the behavior of normal multiplayer "auto-pause".

*NOTE: This doesn't actually pause the game. Clusterio still wants to
communicate with the slaves at all times. This just sets the game speed to a
speed so low, it might as well be paused.*

### How it works
When a player joins or leaves one of the slaves, or a slave comes online
for the first time, we check the state of all the slaves. If all slaves are
empty, we "pause" the game on all slaves. When a player joins any of the
slaves again, we restore the game speed on all slaves.

### Why 
My usecase is not 400 players trying to get to 60k science. I'm working with a
niche community (Pyanodon's mods) that will only have a few people working on
the community server. When no one's playing, I want the server to stop so that
nothing can go wrong in the factory while we're sleeping. When someone joins
back on, start up all the saves again. One base cannot do a Py run without
hitting UPS issues ;)

### config.js
Edit config.js to change the pause speed.

