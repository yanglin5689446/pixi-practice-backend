
const PORT = 30000

const Game = require('./game')
let io = require('socket.io')
let server = io.listen(PORT)

let game = new Game()

console.log('websocket server listening on ' + PORT)
server.on('connection', (client) => {
  console.log(`player connected with id: ${client.id}`)

  client.on('initialize', (data) => {
    console.log(`player ${client.id} set nickname "${data.nickname}"`)
    if(!game.started()) game.start() 
    game.add_player(client.id, data)

    client.emit('initialize', { 
      player: game.state.players[client.id], 
      objects: game.state.objects 
    })
  })
  
  client.on('event', game.handle_event)

  client.on('disconnect', () => {
    console.log(`player ${client.id} disconnected`)
    delete game.state.players[client.id]
    game.updates.disconnected.push(client.id)
  })

  client.on('interact', (data) => {
    game.state.objects.towers.fox.main.hp -= 5
  })

})

const game_loop = () => {
  if(!game.started())return;

  // update players status
  server.local.emit('update', game.updates)
  if(game.state.disconnected)game.state.disconnected = []

}

// 1 tick = 1/20 second
setInterval(game_loop, 1000 / 50)
