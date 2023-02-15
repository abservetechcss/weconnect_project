import { roundDown, roundUp } from "./utils";

const getBoundingBoxes = (nodes = [], nodePadding = 2, roundTo = 2) => {
  let xMax = Number.MIN_SAFE_INTEGER;
  let yMax = Number.MIN_SAFE_INTEGER;
  let xMin = Number.MAX_SAFE_INTEGER;
  let yMin = Number.MAX_SAFE_INTEGER;

  const nodeBoxes = nodes.map((node) => {
    const width = Math.max(node.width || 0, 1);
    const height = Math.max(node.height || 0, 1);

    const position = {
      x: node.positionAbsolute?.x || 0,
      y: node.positionAbsolute?.y || 0
    };

    const topLeft = {
      x: position.x - nodePadding,
      y: position.y - nodePadding
    };
    const bottomLeft = {
      x: position.x - nodePadding,
      y: position.y + height + nodePadding
    };
    const topRight = {
      x: position.x + width + nodePadding,
      y: position.y - nodePadding
    };
    const bottomRight = {
      x: position.x + width + nodePadding,
      y: position.y + height + nodePadding
    };

    if (roundTo > 0) {
      topLeft.x = roundDown(topLeft.x, roundTo);
      topLeft.y = roundDown(topLeft.y, roundTo);
      bottomLeft.x = roundDown(bottomLeft.x, roundTo);
      bottomLeft.y = roundUp(bottomLeft.y, roundTo);
      topRight.x = roundUp(topRight.x, roundTo);
      topRight.y = roundDown(topRight.y, roundTo);
      bottomRight.x = roundUp(bottomRight.x, roundTo);
      bottomRight.y = roundUp(bottomRight.y, roundTo);
    }

    if (topLeft.y < yMin) yMin = topLeft.y;
    if (topLeft.x < xMin) xMin = topLeft.x;
    if (bottomRight.y > yMax) yMax = bottomRight.y;
    if (bottomRight.x > xMax) xMax = bottomRight.x;

    return {
      id: node.id,
      width,
      height,
      topLeft,
      bottomLeft,
      topRight,
      bottomRight
    };
  });

  const graphPadding = nodePadding * 2;

  xMax = roundUp(xMax + graphPadding, roundTo);
  yMax = roundUp(yMax + graphPadding, roundTo);
  xMin = roundDown(xMin - graphPadding, roundTo);
  yMin = roundDown(yMin - graphPadding, roundTo);

  const topLeft = {
    x: xMin,
    y: yMin
  };

  const bottomLeft = {
    x: xMin,
    y: yMax
  };

  const topRight = {
    x: xMax,
    y: yMin
  };

  const bottomRight = {
    x: xMax,
    y: yMax
  };

  const width = Math.abs(topLeft.x - topRight.x);
  const height = Math.abs(topLeft.y - bottomLeft.y);

  const graphBox = {
    topLeft,
    bottomLeft,
    topRight,
    bottomRight,
    width,
    height,
    xMax,
    yMax,
    xMin,
    yMin
  };

  return { nodeBoxes, graphBox };
};

export default getBoundingBoxes;
