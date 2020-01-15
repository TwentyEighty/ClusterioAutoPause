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
	pauseSpeed: 0.01
}
