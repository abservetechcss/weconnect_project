export const getNextPointFromPosition = (point, position) => {
  let positionType = {
    top: { x: point.x, y: point.y - 1 },
    bottom: { x: point.x, y: point.y + 1 },
    left: { x: point.x - 1, y: point.y },
    right: { x: point.x + 1, y: point.y }
  };
  return positionType[position];
};

/**
 * Guarantee that the path is walkable, even if the point is inside a non
 * walkable area, by adding a walkable path in the direction of the point's
 * Position.
 */
export const guaranteeWalkablePath = (grid, point, position) => {
  let node = grid.getNodeAt(point.x, point.y);
  while (!node.walkable) {
    grid.setWalkableAt(node.x, node.y, true);
    const next = getNextPointFromPosition(node, position);
    node = grid.getNodeAt(next.x, next.y);
  }
};
