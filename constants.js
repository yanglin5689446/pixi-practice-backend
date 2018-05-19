
const game = {
  start: false,
  tick: 0,
  players: null,
  disconnected: [],
  objects: {
    particles: [],
    towers: {
      fox: {
        main: { hp: 10000, max_hp: 10000 },
        top: { hp: 10000, max_hp: 10000 },
        bottom: { hp: 10000, max_hp: 10000 }
      },
      panda: {
        main: { hp: 10000, max_hp: 10000 },
        top: { hp: 10000, max_hp: 10000 },
        bottom: { hp: 10000, max_hp: 10000 }
      },
    }

  },
}

const world = { width: 10000, height: 3000 }

module.exports = {
  game, world
}