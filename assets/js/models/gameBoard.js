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
    this.timerDisplay = GameBoardData['timerDisplay'] || 5*60*1000 // seconds on clock
    this.arsenalTimerDisplay = GameBoardData['timerDisplay'] || 0
    this.gameState = GameBoardData['gameState'] || 'waiting' // waiting, setup, playing, ended
    this.boardObjects = GameBoardData['boardObjects'] || []
    this.playerOneRadarDelay = GameBoardData['teamOneRadarDelay'] || 0
    this.playerTwoRadarDelay = GameBoardData['teamTwoRadarDelay'] || 0
    this.shipIcons = GameBoardData['shipIcons'] || []
    this.usedGameCodes = GameBoardData['usedGameCodes'] || []
    this.shipName = ''
    this.shipDetail = ''
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

    Object.defineProperty(this, 'eraseShips', {
        value: function (player) {
            let that = this
            that.boardObjects = that.boardObjects.filter(function (bObject, index) {
                if (player === 'playerTwo') {
                    return bObject.i < 9
                }
                if (player === 'playerOne') {
                    return bObject.i > 8
                }
            })
            that.shipIcons = that.shipIcons.filter(function (bObject, index) {
                if (player === 'playerTwo') {
                    return bObject.i < 9
                }
                if (player === 'playerOne') {
                    return bObject.i > 8
                }
            })
        }
    })

    Object.defineProperty(this, 'addShipIcons', {
        value: function (fullShip) {
            let that = this
            if (fullShip[0].type === 'outpost') {
                let icon = {
                    style: {
                        background: 'url(static/build/img/outpost.dcc1b398008c7bf352dd51bac7b33327.png) no-repeat',
                        transform: `translate(${fullShip[0].i * 42}px, ${(fullShip[0].j * 42) + 11}px)`,
                        height: '42px',
                        width: '42px'
                    },
                    i: fullShip[0].i,
                    j: fullShip[0].j
                }
                that.shipIcons.push(icon)
            }
            if (fullShip[0].type === 'submarine') {
                let icon = {
                    style: {
                        background: 'url(static/build/img/submarine.254114018aa986f7c6be696576e63a15.png) no-repeat',
                        transform: `translate(${(fullShip[0].i * 42) + 4}px, ${(fullShip[0].j * 42) + 11}px)`,
                        height: '42px',
                        width: '42px'
                    },
                    i: fullShip[0].i,
                    j: fullShip[0].j
                }
                that.shipIcons.push(icon)
            }
            if (fullShip[0].type === 'destroyer') {
                let transform = ''
                if (fullShip[0].i === fullShip[1].i) {
                    // rotated
                    transform = `translate(${(fullShip[0].i * 42) - 34}px, ${(fullShip[0].j * 42) + 27}px) rotate(90deg)`
                } else {
                    transform = `translate(${(fullShip[0].i * 42)}px, ${(fullShip[0].j * 42) + 11}px)`
                }
                let icon = {
                    style: {
                        background: 'url(static/build/img/destroyer.e2a4270cb7fb4e6c31e36ade998b2ac3.png) no-repeat',
                        transform: transform,
                        height: '42px',
                        width: '84px'
                    },
                    i: fullShip[0].i,
                    j: fullShip[0].j
                }
                that.shipIcons.push(icon)
            }
            if (fullShip[0].type === 'cruiser') {
                let transform = ''
                if (fullShip[0].i === fullShip[1].i) {
                    // rotated
                    transform = `translate(${(fullShip[0].i * 42) - 43}px, ${(fullShip[0].j * 42) + 47}px) rotate(90deg)`
                } else {
                    transform = `translate(${(fullShip[0].i * 42)}px, ${(fullShip[0].j * 42) + 1}px)`
                }
                let icon = {
                    style: {
                        background: 'url(static/build/img/cruiser.cef0edc615a13e823e568b0be6a7d1f1.png) no-repeat',
                        transform: transform,
                        height: '42px',
                        width: '126px'
                    },
                    i: fullShip[0].i,
                    j: fullShip[0].j
                }
                that.shipIcons.push(icon)
            }
            if (fullShip[0].type === 'carrier') {
                let transform = ''
                if (fullShip[0].i === fullShip[1].i) {
                    // rotated
                    transform = `translate(${(fullShip[0].i * 42) - 34}px, ${(fullShip[0].j * 42) + 27}px) rotate(90deg)`
                } else {
                    transform = `translate(${(fullShip[0].i * 42)}px, ${(fullShip[0].j * 42) + 11}px)`
                }
                let icon = {
                    style: {
                        background: 'url(static/build/img/carrier.89b80c423628919baf8ec16c425e833d.png) no-repeat',
                        transform: transform,
                        height: '84px',
                        width: '126px'
                    },
                    i: fullShip[0].i,
                    j: fullShip[0].j
                }
                that.shipIcons.push(icon)
            }


        }
    })

    Object.defineProperty(this, 'findShipPiece', {
        value: function (player, shipType) {
            let that = this
            let piece = ''
            that.originalShips[player][shipType].map(function (ship) {
                ship.map(function (shipPiece, index) {
                    if (index === 0) {
                        piece = shipPiece
                    }
                })
            })
            return piece
        }
    })

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
        value: function (timerEnd, arsenals, statistics, participantType) {
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

            if (timerEnd !== undefined) {
                let playerOneShipsDestroyed = participantType === 'playerOne' ? statistics.ownShipsDestroyed : statistics.shipsDestroyed
                let playerTwoShipsDestroyed = participantType === 'playerTwo' ? statistics.ownShipsDestroyed : statistics.shipsDestroyed

                let playerOneHits = participantType === 'playerOne' ? statistics.hits : statistics.enemyHits
                let playerTwoHits = participantType === 'playerTwo' ? statistics.hits : statistics.enemyHits
                // if the game ends because the timer expired rather than elimination
                // of another team, then we need to count the ships and see who has more
                // first we check to see who destroyed more ships.
                if (playerOneShipsDestroyed > playerTwoShipsDestroyed) {
                    return 'playerTwo'
                } else if (playerTwoShipsDestroyed > playerOneShipsDestroyed) {
                    return 'playerOne'
                }
                // if the game is still tied then we look at who has the most hits
                if (playerOneHits > playerTwoHits) {
                    return 'playerOne'
                } else if (playerTwoHits > playerOneHits) {
                    return 'playerTwo'
                } else if (playerOneHits === playerTwoHits) {
                    // if still a tie we will add up the arsenal points remaining and whoever has the most
                    // successful codes (i.e. who earned the most arsenal items)
                    let p1 = arsenals.playerOne.salvo + arsenals.playerOne.missile + arsenals.playerOne.torpedo
                    let p2 = arsenals.playerTwo.salvo + arsenals.playerTwo.missile + arsenals.playerTwo.torpedo
                    if (p1 > p2) {
                        return 'playerOne'
                    } else {
                        return 'playerTwo'
                    }
                }
            }
            // if the game ends while the timer is still going it's more trivial to pick a winner
            // as the winner is the one who does not have zero ships remaining
            if (playerOneTotal === 0 && playerTwoTotal > 0 && that.gameState === 'playing') {
                return 'playerTwo'
            } else if (playerOneTotal > 0 && playerTwoTotal === 0 && that.gameState === 'playing') {
                return 'playerOne'
            } else if (playerOneTotal === 0 && playerTwoTotal === 0 && that.gameState === 'playing') {
                // The player that has the most hits should win in a tie and in the case that
                // both teams have hit the same number of ships then the winner should be
                // declared based on the number of puzzles solved.
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

    Object.defineProperty(this, 'shipRemoveGrid', {
        value: function (gridShape, rotate, coords) {
            let icon = {
                style: {
                    background: 'url(static/build/img/remove-icon2.png) no-repeat',
                    transform: `translate(${coords.i * 42}px, ${(coords.j * 42) + 11}px)`,
                    height: '42px',
                    width: '42px'
                },
                i: coords.i,
                j: coords.j
            }
            if (_.some(this.boardObjects, {i: coords.i, j: coords.j})) {
                return [
                    icon
                ]
            } else {
                return []
            }
            
        }
    })

    Object.defineProperty(this, 'eraseShip', {
        value: function (coords) {
            // takes in coords and returns the name of the ship that was removed
            let that = this
            console.log(that.originalShips, that.boardObjects, that.shipIcons);
            for (const player in that.originalShips) {
                if (that.originalShips.hasOwnProperty(player)) {
                    console.log('player', player);
                    
                    for (const shipType in that.originalShips[player]) {
                        if (that.originalShips[player].hasOwnProperty(shipType)) {
                            console.log('shipType', shipType);

                            for (let shipIndex = 0; shipIndex < that.originalShips[player][shipType].length; shipIndex++) {
                                console.log('shipIndex', shipIndex);
                                
                                for (let shipPiece = 0; shipPiece < that.originalShips[player][shipType][shipIndex].length; shipPiece++) {
                                    const piece = that.originalShips[player][shipType][shipIndex][shipPiece];
                                    console.log(piece, coords);
                                    if (piece.i == coords.i && piece.j == coords.j) {
                                        that.shipName = shipType
                                        that.shipDetails = that.originalShips[player][shipType][shipIndex]
                                        that.originalShips[player][shipType].splice(shipIndex, 1)
                                        break
                                    }
                                }                        
                            }
                        }
                    }
                }
            }
            
            console.log(that.shipName, that.shipDetails);
            console.log('original ships', that.originalShips);
            
            
            // need to find these coords in original ships and then use that data to 
            // wipe the boardobject, shipIcons, and ship counters

            for (let shipPieceIndex = 0; shipPieceIndex < that.shipDetails.length; shipPieceIndex++) {
                const shipPiece = that.shipDetails[shipPieceIndex];
                that.boardObjects.map(function (bObject, index) {
                    if (bObject.i === shipPiece.i && bObject.j === shipPiece.j) {
                        that.boardObjects.splice(index, 1)
                    }
                })
                
            }

            for (let shipPieceIndex = 0; shipPieceIndex < that.shipDetails.length; shipPieceIndex++) {
                const shipPiece = that.shipDetails[shipPieceIndex];
                that.shipIcons.map(function (bObject, index) {
                    if (bObject.i === shipPiece.i && bObject.j === shipPiece.j) {
                        that.shipIcons.splice(index, 1)
                    }
                })
                
            }

            return that.shipName
            
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
