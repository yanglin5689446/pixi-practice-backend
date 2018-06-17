
const PORT = 30000

const game = require('./game')
let io = require('socket.io')
let server = io.listen(PORT)


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
    if(game.state.players[client.id]){
      delete game.state.players[client.id]
      game.updates.disconnected.push(client.id)      
    }

  })
})

const game_loop = () => {
  if(!game.started())return;
  if(!Object.keys(game.state.players).length)return;

  const winner = game.check_winner()
  if(!game.overed()){
    if(winner.fox || winner.panda){
      game.set_winner(winner)
      setTimeout(() => {
        game.cleanup()
        Object.keys(server.sockets.sockets)
          .forEach(key =>  server.sockets.sockets[key].disconnect(true))
      }, 10000)
    }    
  }

  game.update()
  // update players status
  server.local.emit('update', game.updates)

  if(game.updates.disconnected)game.updates.disconnected = []
  if(game.updates.attacks)game.updates.attacks = []

}

// 1 tick = 1/20 second
setInterval(game_loop, 1000 / 50)
