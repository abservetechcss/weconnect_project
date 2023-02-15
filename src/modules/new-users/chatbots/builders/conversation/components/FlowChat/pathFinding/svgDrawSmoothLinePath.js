export const svgDrawSmoothLinePath = (source, target, path) => {
  const points = [[source.x, source.y], ...path, [target.x, target.y]];
  return quadraticBezierCurve(points);
};

const quadraticBezierCurve = (points) => {
  const X = 0;
  const Y = 1;
  let point = points[0];

  const first = points[0];
  let svgPath = `M${first[X]},${first[Y]}M`;

  for (let i = 0; i < points.length; i++) {
    const next = points[i];
    const midPoint = getMidPoint(point[X], point[Y], next[X], next[Y]);

    svgPath += ` ${midPoint[X]},${midPoint[Y]}`;
    svgPath += `Q${next[X]},${next[Y]}`;
    point = next;
  }

  const last = points[points.length - 1];
  svgPath += ` ${last[0]},${last[1]}`;

  return svgPath;
};

const getMidPoint = (Ax, Ay, Bx, By) => {
  const Zx = (Ax - Bx) / 2 + Bx;
  const Zy = (Ay - By) / 2 + By;
  return [Zx, Zy];
};
