import io from 'socket.io-client'

export const socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port)
