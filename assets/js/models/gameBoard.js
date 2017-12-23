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
    this.boardObjects = GameBoardData['boardObjects'] || []
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
        destroyer: '#0044f0',
        cruiser: '#00f0b5',
        carrier: '#00b0f0',
        submarine: '#002060',
        outpost:  '#b05300',
        torpedo: '#ff0000',
        missile: '#ff0000',
        salvo: '#ff0000',
        radar: '#fe9999',
    }

    Object.defineProperty(this, 'grid', {
        get: function () {
            return _.range(17).map(function (item) {
               return _.range(9)
            })
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
        value: function (coords, selectedItem) {
            var that = this
            return coords.some(function (coord) {
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
