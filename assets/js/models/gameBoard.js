import moment from 'moment'
import {socket} from '../socket.js'
import _ from 'lodash'

export function GameBoard (GameBoardData) {
    if (GameBoardData === undefined) {
        GameBoardData = {}
    }
    if (!(this instanceof GameBoard)) {
        return new GameBoard(GameBoardData)
    }
    // limits are expressed in number of squares occupied
    this.shipLimits = {
        carrier: 6,
        cruiser: 6,
        destroyer: 6,
        submarine: 2,
        outpost: 2
    }
    this.timerDisplay = GameBoardData['timerDisplay'] || '05:00'
    this.arsenalTimerDisplay = GameBoardData['timerDisplay'] || '02:00'
    this.gameState = GameBoardData['gameState'] || 'waiting' // waiting, setup, playing, ended
    this.boardObjects = GameBoardData['boardObjects'] || []
    this.usedGameCodes = GameBoardData['usedGameCodes'] || []
    this.badGuesses = GameBoardData['badGuesses'] || 0
    this.hitMissGrid = GameBoardData['hitMissGrid'] || []
    this.originalShips = GameBoardData['hitMissGrid'] || {
        playerOne: {
            destroyer: [],
            cruiser: [],
            carrier: [],
            outpost: [],
            submarine: []
        },
        playerTwo: {
            destroyer: [],
            cruiser: [],
            carrier: [],
            outpost: [],
            submarine: []
        }
    }
    this.landCoords = GameBoardData['landCoords'] || [
        {i: 4, j: 1},
        {i: 5, j: 1},
        {i: 8, j: 1},
        {i: 13, j: 1},
        {i: 13, j: 2},
        {i: 6, j: 3},
        {i: 8, j: 3},
        {i: 9, j: 3},
        {i: 10, j: 3},
        {i: 16, j: 3},
        {i: 1, j: 4},
        {i: 8, j: 4},
        {i: 9, j: 4},
        {i: 16, j: 4},
        {i: 5, j: 5},
        {i: 6, j: 5},
        {i: 7, j: 5},
        {i: 10, j: 7},
        {i: 14, j: 7},
        {i: 15, j: 7},
        {i: 6, j: 8},
        {i: 8, j: 8},
        {i: 9, j: 8},
        {i: 10, j: 8}
    ]
    this.colors = GameBoardData['colors'] || {
        destroyer: 'rgba(0, 68, 240, 0.5)',
        cruiser: 'rgba(0, 240, 181, 0.5)',
        carrier: 'rgba(0, 176, 240, 0.5)',
        submarine: 'rgba(0, 32, 96, 0.5)',
        outpost:  'rgba(176, 83, 0, 0.5)',
        torpedo: '#ff0000',
        missile: '#ff0000',
        salvo: '#ff0000',
        radar: '#fe9999'
    }

    Object.defineProperty(this, 'grid', {
        get: function () {
            return _.range(17).map(function (item) {
               return _.range(9)
            })
        }
    })

    Object.defineProperty(this, 'removeShipPiece', {
        value: function (hit, hitSquare) {
            let that = this
            let player = hit.i > 8 ? 'playerTwo' : 'playerOne'
            let shipDestroyed = {
                result: false,
                ship: ''
            }
            that.originalShips[player][hitSquare.type].map(function (ship) {
                ship.map(function (shipPiece, index) {
                    if (shipPiece.i === hitSquare.i && shipPiece.j === hitSquare.j) {
                        ship.splice(index, 1)
                    }
                })
            })
            that.originalShips[player][hitSquare.type].map(function (ship, index) {
                if (ship.length === 0) {
                    shipDestroyed.result= true
                    shipDestroyed.ship = hitSquare.type
                    that.originalShips[player][hitSquare.type].splice(index, 1)
                }
            })
            return shipDestroyed
        }
    })

    Object.defineProperty(this, 'checkVictoryConditions', {
        value: function () {
            let that = this
            let playerOneTotal = 0
            let playerTwoTotal = 0
            playerOneTotal += that.originalShips.playerOne.destroyer.length
            playerOneTotal += that.originalShips.playerOne.carrier.length
            playerOneTotal += that.originalShips.playerOne.cruiser.length
            playerOneTotal += that.originalShips.playerOne.submarine.length
            playerOneTotal += that.originalShips.playerOne.outpost.length
            playerTwoTotal += that.originalShips.playerTwo.destroyer.length
            playerTwoTotal += that.originalShips.playerTwo.carrier.length
            playerTwoTotal += that.originalShips.playerTwo.cruiser.length
            playerTwoTotal += that.originalShips.playerTwo.submarine.length
            playerTwoTotal += that.originalShips.playerTwo.outpost.length
            if (playerOneTotal === 0 && playerTwoTotal > 0 && that.gameState === 'playing') {
                return 'playerTwo'
            } else if (playerOneTotal > 0 && playerTwoTotal === 0 && that.gameState === 'playing') {
                return 'playerOne'
            } else if (playerOneTotal === 0 && playerTwoTotal === 0 && that.gameState === 'playing') {
                return 'tie'
            } else {
                return false
            }
        }
    })

    Object.defineProperty(this, 'shipCount', {
        value: function () {
            let that = this
            let ships = {
                playerOne: {
                    destroyer: that.originalShips.playerOne.destroyer.length,
                    cruiser: that.originalShips.playerOne.cruiser.length,
                    carrier: that.originalShips.playerOne.carrier.length,
                    outpost: that.originalShips.playerOne.outpost.length,
                    submarine: that.originalShips.playerOne.submarine.length
                },
                playerTwo: {
                    destroyer: that.originalShips.playerTwo.destroyer.length,
                    cruiser: that.originalShips.playerTwo.cruiser.length,
                    carrier: that.originalShips.playerTwo.carrier.length,
                    outpost: that.originalShips.playerTwo.outpost.length,
                    submarine: that.originalShips.playerTwo.submarine.length
                }
            }
            return ships
        }
    })

    Object.defineProperty(this, 'shipLimitExceeded', {
        value: function (shipType, hoverGrid) {
            var side = hoverGrid[0].i < 9 ? 'left' : 'right'
            var shipSquares = 0
            this.boardObjects.map(function (each) {
                if (each.type === shipType) {
                    if (side === 'left' && each.i < 9) {
                        shipSquares += 1
                    } else if (side === 'right' && each.i > 8) {
                        shipSquares += 1
                    }
                }
            })
            if (shipSquares >= this.shipLimits[shipType]) {
                return true
            } else {
                false
            }
        }
    })

    Object.defineProperty(this, 'areInvalid', {
        value: function (coords, selectedItem, participant) {
            var that = this
            return coords.some(function (coord) {
                // Check to make sure players can only place ships on their sides
                if (participant === 1 && coord.i > 8) {
                    return true
                }
                if (participant === 2 && coord.i < 9) {
                    return true
                }
                // Check to see if coords are outside the gameboard
                if (coord.j === 0 || coord.i === 0 || coord.i > 16 || coord.j > 8) {
                    return true
                }
                // Check to see if a ship spans both sides of the board
                if (9 > coord.i && coord.i >= 7 && coords.some(function (coord) {
                    return coord.i >= 9
                })) {
                    return true
                } else if (11 > coord.i && coord.i >= 9 && coords.some(function (coord) {
                    return coord.i < 9
                })) {
                    return true
                }
                // cruisers,destroyers, submarines, and carriers can only be on water
                if (selectedItem != 'outpost' &&
                    _.some(that.landCoords, {i: coord.i, j: coord.j}) ||
                    _.some(that.boardObjects, {i: coord.i, j: coord.j})) {
                    return true
                } else if (selectedItem === 'outpost' &&
                           !_.some(that.landCoords, {i: coord.i, j: coord.j}) ||
                           _.some(that.boardObjects, {i: coord.i, j: coord.j})) {
                    return true
                }
            })
        }
    })

    Object.defineProperty(this, 'hoverGrid', {
        value: function (gridShape, rotate, coords) {
            if (gridShape === 'radar') {
                return [
                    {i: coords.i, j: coords.j},
                    {i: coords.i + 1, j: coords.j + 1},
                    {i: coords.i + 1, j: coords.j},
                    {i: coords.i + 1, j: coords.j - 1},
                    {i: coords.i, j: coords.j - 1},
                    {i: coords.i, j: coords.j + 1},
                    {i: coords.i - 1, j: coords.j + 1},
                    {i: coords.i - 1, j: coords.j},
                    {i: coords.i - 1, j: coords.j - 1}
                ]
            } else if (gridShape === 'threeWide') {
                if (rotate) {
                    return [
                        {i: coords.i, j: coords.j - 1},
                        {i: coords.i, j: coords.j},
                        {i: coords.i, j: coords.j + 1}
                    ]
                } else {
                    return [
                        {i: coords.i - 1, j: coords.j},
                        {i: coords.i, j: coords.j},
                        {i: coords.i + 1, j: coords.j}
                    ]
                }
            } else if (gridShape === 'one') {
                return [
                    {i: coords.i, j: coords.j}
                ]
            } else if (gridShape === 'twoWide') {
                if (rotate) {
                    return [
                        {i: coords.i, j: coords.j - 1},
                        {i: coords.i, j: coords.j}
                    ]
                } else {
                    return [
                        {i: coords.i - 1, j: coords.j},
                        {i: coords.i, j: coords.j}
                    ]
                }
            } else if (gridShape === 'carrier') {
                if (rotate) {
                    return [
                        {i: coords.i, j: coords.j - 1},
                        {i: coords.i, j: coords.j},
                        {i: coords.i, j: coords.j + 1},
                        {i: coords.i + 1, j: coords.j - 1},
                        {i: coords.i + 1, j: coords.j},
                        {i: coords.i + 1, j: coords.j + 1}
                    ]
                } else {
                    return [
                        {i: coords.i - 1, j: coords.j},
                        {i: coords.i, j: coords.j},
                        {i: coords.i + 1, j: coords.j},
                        {i: coords.i - 1, j: coords.j + 1},
                        {i: coords.i, j: coords.j + 1},
                        {i: coords.i + 1, j: coords.j + 1}
                    ]
                }
            }
        }
    })
}
