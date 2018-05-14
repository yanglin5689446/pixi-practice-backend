
const game = {
  start: false,
  tick: 0,
  players: null,
  disconnected: [],
  objects: {
    particles: []
  },
}

const world = { width: 5000, height: 5000 }

module.exports = {
  game, world
}