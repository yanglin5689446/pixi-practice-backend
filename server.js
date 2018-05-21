
const PORT = 30000

const { game, world, updates } = require('./constants')
const Player = require('./player')
let io = require('socket.io')
let server = io.listen(PORT)

console.log('websocket server listening on ' + PORT)

function initialize_game () {
  game.tick = 0
  game.objects.particles = Array(500).fill(0).map(i => ({ 
    x: world.width * Math.random(), 
    y: world.height * Math.random()
  }))
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
    let player = new Player(client.id, data.nickname)
    game.players[client.id] = player
    client.on('event', player.handle_event)
    client.emit('initialize', { player, objects: game.objects })
  })

  client.on('disconnect', () => {
    console.log(`player ${client.id} disconnected`)
    delete game.players[client.id]
    game.disconnected.push(client.id)
  })

  client.on('interact', (data) => {
    game.objects.towers.fox.main.hp -= 5
  })

})

const game_loop = () => {
  if(!game.start)return;
  
  let new_particles = [], removal_particles = []

  // update particles state
  // delete eaten particles
  game.objects.particles.forEach((particle, index) => {
    if(!particle)removal_particles.push(index)
  })

  if(game.tick % 1200 === 0){
    // add 20 particles if partilcles less than maximum number
    if(game.objects.particles.filter(particle => particle).length < 500 - 20){
      for(let i = 0 ;i < 20; i ++){
        let new_particle = { 
          x: world.width * Math.random(), 
          y: world.height * Math.random()
        }
        game.objects.particles.push(new_particle)
        new_particles.push(new_particle)
      }  
    }
  }
  const updates = {
    players: game.players,
    disconnected: game.disconnected,
    objects: {
      particles: {
        news: new_particles,
        removals: removal_particles
      },
      towers: game.objects.towers
    }
  }
  // update players status
  server.local.emit('update', updates)

  if(game.disconnected)game.disconnected = []

  game.tick ++
}

// 60fps
setInterval(game_loop, 1000 / 16)
