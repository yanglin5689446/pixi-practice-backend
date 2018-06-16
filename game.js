
const Player = require('./player')
const Tower = require('./tower')

const { world_size } = require('./constants')



class Game {
  constructor(){
    this.start = this.start.bind(this)
    this.started = this.started.bind(this)
    this.add_player = this.add_player.bind(this)
    this.handle_event = this.handle_event.bind(this)
  }
  started(){
    return this._start
  }
  start(){
    this._start = true
    const tower_margin = 300
    const r = 1000
    const ww = world_size.width, wh = world_size.height

    this.state = {  
      players: {},
      disconnected: [],
      objects: {
        towers: [
          new Tower(tower_margin,  wh / 2, 1, 1),
          new Tower(tower_margin + r * Math.cos(30), r * Math.sin(30) + wh/2, 2, 1),
          new Tower(tower_margin + r * Math.cos(120), r * Math.sin(120) + wh/2, 2, 1),
          new Tower(tower_margin + r * Math.cos(-120), r * Math.sin(-120) + wh/2, 2, 1),
          new Tower(tower_margin + r * Math.cos(-30), r * Math.sin(-30) + wh/2, 2, 1),
          new Tower(ww - tower_margin, wh/2, 1, 2),
          new Tower(ww - tower_margin - r * Math.cos(30), r * Math.sin(30) + wh/2, 2, 2),
          new Tower(ww - tower_margin - r * Math.cos(120), r * Math.sin(120) + wh/2, 2, 2),
          new Tower(ww - tower_margin - r * Math.cos(-120), r * Math.sin(-120) + wh/2, 2, 2),
          new Tower(ww - tower_margin - r * Math.cos(-30), r * Math.sin(-30) + wh/2, 2, 2),
        ],
        coins: {
          data: {},
          removed:[]
        },
        
      },
    }
    this.updates = {
      players: this.state.players,
      disconnected: this.state.disconnected,
      objects: this.state.objects,
      attacks: []
    } 
  }
  add_player(id, data){
    this.state.players[id] = new Player(id, data.nickname, data.team)
  }
  handle_event(event){
    if(!this._start)this.start()
    if(this._over)return 

    const players = this.state.players
    const objects = this.state.objects
    if(event.type != 'update')console.log(event.payload)

    try{
      switch(event.type){
        case 'update':
          players[event.payload.id].movement(event.payload)
          break
        case 'click':
          if(['tower', 'player'].includes(event.payload.target.type))
            players[event.payload.player].attack(event.payload.target)
          if(['coin'].includes(event.payload.target.type))
            players[event.payload.player].pick(event.payload.target)
          if(['abilities'].includes(event.payload.target.type))
            players[event.payload.player].enhance(event.payload.target)
          break
      }
    }
    catch(err){
      console.log(err)
    }
  }
  check_over(){

  }
  over() {

  }
}

let game = new Game()

module.exports = game