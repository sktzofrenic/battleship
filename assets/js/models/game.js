import moment from 'moment'
import axios from 'axios'

export function Game (gameData) {
    if (gameData === undefined) {
        gameData = {}
    }
    if (!(this instanceof Game)) {
        return new Game(gameData)
    }

    this.id = gameData['id'] || undefined
    this.name = gameData['name'] || ''
    this.startedOn = gameData['startedOn'] || null
    this.createdOn = gameData['createdOn'] || moment()
    this.isOffsite = gameData['isOffsite'] || false
    this.gameCodeSetID = gameData['gameCodeSetID'] || undefined
    this.status = gameData['status'] || 'Waiting for players...'
    this.players = gameData['status'] || []

    Object.defineProperty(this, 'gameName', {
        get: function () {
            return this.name
        }
    })

    Object.defineProperty(this, 'start', {
        value: function (callBack) {
            var that = this
            axios.post(`/api/v1/games`, {
                name: this.name,
                createdOn: this.createdOn.format('YYYY-MM-DD HH:mm'),
                startedOn: this.startedOn.format('YYYY-MM-DD HH:mm'),
                isOffsite: this.isOffsite,
                gameCodeSetID: this.gameCodeSetID
            }).then(function (response) {
                that.id = response.data.game.id
                callBack()
            })
        }
    })

    Object.defineProperty(this, 'end', {
        value: function (callBack) {
            var that = this
            axios.delete(`/api/v1/game/${that.id}`).then(function (response) {
                callBack()
            })
        }
    })
}
