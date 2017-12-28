import moment from 'moment'
import axios from 'axios'
import {store} from '../store/store.js'
import {socket} from '../socket.js'

export function Game (gameData) {
    if (gameData === undefined) {
        gameData = {}
    }
    if (!(this instanceof Game)) {
        return new Game(gameData)
    }

    this.id = gameData['id'] || undefined
    this.name = gameData['name'] || ''
    this.startedOn = gameData['startedOn'] || gameData['started_on'] || moment()
    this.createdOn = gameData['createdOn'] || gameData['created_on'] || moment()
    this.isOffsite = gameData['isOffsite'] || gameData['is_offsite'] || false
    this.gameCodeSetID = gameData['gameCodeSetID'] || gameData['game_code_set_id'] || undefined
    this.status = gameData['status'] || 'Waiting for players...'
    this.players = gameData['players'] || []

    Object.defineProperty(this, 'gameName', {
        get: function () {
            return this.name
        }
    })

    Object.defineProperty(this, 'create', {
        value: function (callBack) {
            var that = this
            axios.post(`/api/v1/games`, {
                name: this.name,
                createdOn: this.createdOn.format('YYYY-MM-DD HH:mm'),
                isOffsite: this.isOffsite,
                gameCodeSetID: this.gameCodeSetID
            }).then(function (response) {
                that.id = response.data.game.id
                callBack()
                socket.emit('create-game', {
                    id: that.id
                })
            })
        }
    })

    Object.defineProperty(this, 'joinGame', {
        value: function (callBack) {
            var that = this
            socket.emit('join-game', {
                id: that.id
            })
            callBack()
        }
    })

    Object.defineProperty(this, 'end', {
        value: function (callBack) {
            var that = this
            socket.emit('end-game', {id: that.id})
        }
    })

    Object.defineProperty(this, 'serialize', {
        value: function () {
            return {
                name: this.name,
                startedOn: this.startedOn,
                createdOn: this.createdOn,
                isOffsite: this.isOffsite,
                gameCodeSetID: this.gameCodeSetID
            }
        }
    })
}
