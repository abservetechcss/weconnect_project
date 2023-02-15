export const graphToGridPoint = (
  graphPoint,
  smallestX,
  smallestY,
  gridRatio
) => {
  let x = graphPoint.x / gridRatio;
  let y = graphPoint.y / gridRatio;

  let referenceX = smallestX / gridRatio;
  let referenceY = smallestY / gridRatio;

  if (referenceX < 1) {
    while (referenceX !== 1) {
      referenceX++;
      x++;
    }
  } else if (referenceX > 1) {
    while (referenceX !== 1) {
      referenceX--;
      x--;
    }
  } else {
    // Nothing to do
  }

  if (referenceY < 1) {
    while (referenceY !== 1) {
      referenceY++;
      y++;
    }
  } else if (referenceY > 1) {
    while (referenceY !== 1) {
      referenceY--;
      y--;
    }
  } else {
    // Nothing to do
  }

  return { x, y };
};

/**
 * Converts a grid point back to a graph point, using the reverse logic of
 * graphToGridPoint.
 */
export const gridToGraphPoint = (
  gridPoint,
  smallestX,
  smallestY,
  gridRatio
) => {
  let x = gridPoint.x * gridRatio;
  let y = gridPoint.y * gridRatio;

  let referenceX = smallestX;
  let referenceY = smallestY;

  if (referenceX < gridRatio) {
    while (referenceX !== gridRatio) {
      referenceX = referenceX + gridRatio;
      x = x - gridRatio;
    }
  } else if (referenceX > gridRatio) {
    while (referenceX !== gridRatio) {
      referenceX = referenceX - gridRatio;
      x = x + gridRatio;
    }
  } else {
    // Nothing to do
  }

  if (referenceY < gridRatio) {
    while (referenceY !== gridRatio) {
      referenceY = referenceY + gridRatio;
      y = y - gridRatio;
    }
  } else if (referenceY > gridRatio) {
    while (referenceY !== gridRatio) {
      referenceY = referenceY - gridRatio;
      y = y + gridRatio;
    }
  } else {
    // Nothing to do
  }

  // console.log("referenceX, referenceY, x,y", referenceX, referenceY, x, y);

  return { x, y };
};
