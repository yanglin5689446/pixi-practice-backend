
const PORT = 30000

let io = require('socket.io')
let server = io.listen(PORT)

console.log('websocket server listening on ' + PORT)

const world = { width: 5000, height: 5000 }

let tick = 0
let players = {}
let disconnected = []


const event_handler = (event) => {
  
}

class Player{
  constructor(id){
    this.x = Math.random() * world.height
    this.y = Math.random() * world.width
    this.rotation = 0

    this.id = id
    
    this.handle_event = this.handle_event.bind(this)
  }
  handle_event(event){
    switch(event.type){
      case 'update_position':
        this.x = event.payload.x
        this.y = event.payload.y
        this.rotation = event.payload.rotation
        break
    }
  }
}

server.on('connection', (client) => {
  console.log(`player connected with id: ${client.id}`)
  player = new Player(client.id)
  players[client.id] = player

  client.on('disconnect', () => {
    console.log(`player ${client.id} disconnected`)
    delete players[client.id]
    disconnected.push(client.id)
  })

  client.on('event', player.handle_event)
  client.emit('initialize', player)
})

const game_loop = () => {
  let data = {
    players,
    disconnected
  }

  // update players status
  server.local.emit('render', data);

  if(disconnected)disconnected = []

  tick ++
}

// 60fps
setInterval(game_loop, 1000 / 60)
