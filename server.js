
const PORT = 30000

const { game, world } = require('./constants')
const Player = require('./player')
let io = require('socket.io')
let server = io.listen(PORT)

console.log('websocket server listening on ' + PORT)

let updates = {}

function initialize_game () {
  updates = {
    players: game.players,
    disconnected: game.disconnected,
    objects: {
      towers: game.objects.towers
    }
  }
}



server.on('connection', (client) => {
  console.log(`player connected with id: ${client.id}`)

  client.on('initialize', (data) => {
    console.log(`player ${client.id} set nickname "${data.nickname}"`)
    if(!game.players){
      game.players = {}
      initialize_game()
      game.start = true
    }
    let player = new Player(client.id, data.nickname, data.team)
    game.players[client.id] = player
    client.on('event', player.handle_event)
    client.emit('initialize', { player, objects: game.objects })
  })

  client.on('disconnect', () => {
    console.log(`player ${client.id} disconnected`)
    delete game.players[client.id]
    updates.disconnected.push(client.id)
  })

  client.on('interact', (data) => {
    game.objects.towers.fox.main.hp -= 5
  })

})

const game_loop = () => {
  if(!game.start)return;

  // update players status
  server.local.emit('update', updates)
  if(updates.disconnected)updates.disconnected = []

}

// 1 tick = 1/20 second
setInterval(game_loop, 1000 / 50)
