export function AIPlayer (AIPlayerData) {
    if (AIPlayerData === undefined) {
        AIPlayerData = {}
    }
    if (!(this instanceof AIPlayer)) {
        return new AIPlayer(AIPlayerData)
    }
    this.delay = 0 // delay in seconds to be added to the next AI script

    // The numbers is the number of seconds elapsed for the opponent ship
    // piece to be destroyed. The delay is added to this number.
    // If an AI ship is hit, the delay will increase.
    this.actions_ = [
        {'time': 2, 'shipPiece': 'destroyer'},
        {'time': 4, 'shipPiece': 'destroyer'},
        {'time': 6, 'shipPiece': 'cruiser'},
        {'time': 8, 'shipPiece': 'submarine'},
        {'time': 10, 'shipPiece': 'cruiser'},
        {'time': 12, 'shipPiece': 'cruiser'},
        {'time': 14, 'shipPiece': 'destroyer'},
        {'time': 16, 'shipPiece': 'carrier'},
        {'time': 18, 'shipPiece': 'destroyer'},
        {'time': 20, 'shipPiece': 'carrier'},
        {'time': 22, 'shipPiece': 'carrier'},
        {'time': 24, 'shipPiece': 'carrier'},
        {'time': 26, 'shipPiece': 'carrier'},
        {'time': 28, 'shipPiece': 'carrier'},
        {'time': 30, 'shipPiece': 'outpost'},
        {'time': 32, 'shipPiece': 'cruiser'},
        {'time': 34, 'shipPiece': 'cruiser'},
        {'time': 36, 'shipPiece': 'submarine'},
        {'time': 38, 'shipPiece': 'cruiser'},
        {'time': 40, 'shipPiece': 'destroyer'},
        {'time': 42, 'shipPiece': 'destroyer'},
        {'time': 44, 'shipPiece': 'outpost'}
    ]
    this.actions = [
        {'time': 300, 'shipPiece': 'destroyer'},
        {'time': 600, 'shipPiece': 'destroyer'},
        {'time': 720, 'shipPiece': 'cruiser'},
        {'time': 840, 'shipPiece': 'submarine'},
        {'time': 960, 'shipPiece': 'cruiser'},
        {'time': 1080, 'shipPiece': 'cruiser'},
        {'time': 1320, 'shipPiece': 'destroyer'},
        {'time': 1380, 'shipPiece': 'carrier'},
        {'time': 1440, 'shipPiece': 'destroyer'},
        {'time': 1560, 'shipPiece': 'carrier'},
        {'time': 1620, 'shipPiece': 'carrier'},
        {'time': 1680, 'shipPiece': 'carrier'},
        {'time': 1740, 'shipPiece': 'carrier'},
        {'time': 1920, 'shipPiece': 'carrier'},
        {'time': 2040, 'shipPiece': 'outpost'},
        {'time': 2100, 'shipPiece': 'cruiser'},
        {'time': 2160, 'shipPiece': 'cruiser'},
        {'time': 2280, 'shipPiece': 'submarine'},
        {'time': 2340, 'shipPiece': 'cruiser'},
        {'time': 2460, 'shipPiece': 'destroyer'},
        {'time': 2700, 'shipPiece': 'destroyer'},
        {'time': 3000, 'shipPiece': 'outpost'}
    ]
}
