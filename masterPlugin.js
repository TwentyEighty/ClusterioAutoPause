const fs = require("fs-extra");
const path = require("path");
const Express = require("express");
const ejs = require("ejs");
const bcrypt = require("bcrypt-promise");
const crypto = require('crypto');
const base64url = require('base64url');
const sanitizer = require('sanitizer');

const moduleConfig = require("./config");

const pmSockets = [];

class masterPlugin {
    constructor({config, pluginConfig, pluginPath, socketio, express}){
        this.config = config;
        this.pluginConfig = pluginConfig;
        this.pluginPath = pluginPath;
        this.io = socketio;
        this.app = express;

        this.slaves = {};
        this.currentState = 'notempty'

        this.io.on("connection", socket => {
            let instanceID = "unknown";
            socket.on("registerSlave", data => {
                if(data.instanceID && !isNaN(Number(data.instanceID))){
                    instanceID = data.instanceID;
                    this.slaves[instanceID] = {
                        socket: socket,
                        playerCount: null,
                        unpausedGameSpeed: null
                    };
                }
            });
            socket.on("onPlayerCountUpdate", data => {
                this.updatePlayerCount(instanceID, parseInt(data.playerCount), parseFloat(data.gameSpeed));
            });
        });
    }
    async onLoadFinish({plugins}){
        this.masterPlugins = plugins;
    }

    updatePlayerCount(instanceID, playerCount, gameSpeed) {
        var addedSlave = false;
        if (this.slaves[instanceID].playerCount == null) {
            let initGameSpeed = gameSpeed != moduleConfig.pauseSpeed ? gameSpeed : 1.0;
            console.log('clusterioAutoPause: Initialize slave[' + instanceID + ']: playerCount:',
                playerCount, ' unpaused gameSpeed:', initGameSpeed)
            this.slaves[instanceID].playerCount = playerCount;
            this.slaves[instanceID].unpausedGameSpeed = initGameSpeed;
            addedSlave = true;
        }

        this.slaves[instanceID].playerCount = playerCount;
        if (gameSpeed != moduleConfig.pauseSpeed) {
            this.slaves[instanceID].unpausedGameSpeed = gameSpeed;
        }

        let totalCount = 0;
        for (var slave in this.slaves) {
            totalCount = totalCount + this.slaves[slave].playerCount;
        }

        if (totalCount == 0 && (this.currentState == 'notempty' || addedSlave)) {
            console.log('clusterioAutoPause: Pausing (slowing down) all slaves to ', moduleConfig.pauseSpeed);
            for (var slave in this.slaves) {
                this.slaves[slave].socket.emit('setGameSpeed', moduleConfig.pauseSpeed);
            }
            this.currentState = 'empty';
        } else if (totalCount > 0 && this.currentState == 'empty') {
            console.log('clusterioAutoPause: Restoring game speed of all slaves');
            for (var slave in this.slaves) {
                this.slaves[slave].socket.emit('setGameSpeed', this.slaves[slave].unpausedGameSpeed);
            }
            this.currentState = 'notempty';
        }

        console.log('clusterioAutoPause: Total cluster player count=', totalCount)
    }
}
module.exports = masterPlugin;
