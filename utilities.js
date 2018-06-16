

function distance_between(object1, object2){
  const x1 = object1.stats.x, y1 = object1.stats.y
  const x2 = object2.stats.x, y2 = object2.stats.y
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}

module.exports = { distance_between }