
const game = {
  start: false,
  tick: 0,
  players: null,
  disconnected: [],
  objects: {
    particles: []
  },
}

const world = { width: 500, height: 500 }

module.exports = {
  game, world
}