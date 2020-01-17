/*
	Clusterio plugin to allow for chat between instances.
*/
module.exports = {
	// Name of package. For display somewhere I guess.
	name: "clusterioAutoPause",
	version: "1.0.0",
	binary: "nodePackage",
	description: "Automatically 'pauses' the game (sets speed to really low) when all servers are empty",
	masterPlugin: "masterPlugin.js",
	scriptOutputFileSubscription: "clusterioAutoPause.txt",
	
	// 0.01 is too slow, clusterio times out and even factorio gets upset. 0.05 seems ok
	pauseSpeed: 0.05
}
