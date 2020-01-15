module.exports = class clusterioAutoPause {
    constructor(mergedConfig, messageInterface, extras){
        this.messageInterface = messageInterface;
        this.config = mergedConfig;
        this.socket = extras.socket;

        this.socket.on("hello", () => {
            // send initial player count
            this.updatePlayerCount(extras.socket, messageInterface);
        });

        this.socket.on("setGameSpeed", gameSpeed => {
            console.log('clusterioAutoPause: Setting game speed to ', gameSpeed)
            messageInterface('/silent-command game.print("clusterioAutoPause: Setting game speed to ' + gameSpeed + '")');
            messageInterface('/silent-command game.speed = ' + gameSpeed);
        });
    }

    updatePlayerCount(socket, messageInterface) {
        messageInterface(`/silent-command rcon.print(#game.connected_players)`, function (playerCount) {
            messageInterface(`/silent-command rcon.print(game.speed)`, function (gameSpeed) {
                socket.emit("onPlayerCountUpdate", {
                    playerCount: playerCount,
                    gameSpeed: gameSpeed
                })
            });
        });
    }

    getMessageType(data) {
        if (data.includes("[JOIN]")) {
            return "[JOIN]";
        } else if (data.includes("[LEAVE]")) {
            return "[LEAVE]";
        }
        return null;
    }

    async factorioOutput(data){
        try{
            let messageType = this.getMessageType(data);

            if (messageType=="[JOIN]" || messageType=="[LEAVE]"){
                this.updatePlayerCount(this.socket, this.messageInterface);
            }
        } catch(e) {console.log(e)}
    }
}
