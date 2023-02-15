import {
  JumpPointFinder,
  DiagonalMovement
  // Util
  // OrthogonalJumpPointFinder,
  // BiBreadthFirstFinder,
  // BiDijkstraFinder,
  // IDAStarFinder,
  // DijkstraFinder,
  // BreadthFirstFinder,
  // AStarFinder,
  // BestFirstFinder
} from "pathfinding";

export const pathfindingJumpPointNoDiagonal = (grid, start, end) => {
  try {
    // FIXME: The "pathfinding" module doe not have proper typings.
    // @ts-ignore
    const finder = new JumpPointFinder({
      diagonalMovement: DiagonalMovement.Never
    });
    // const finder = new BiBreadthFirstFinder(); // same as JumpPointFinder but too overlapping
    // const finder = new OrthogonalJumpPointFinder(); // not producing path
    // const finder = new BiDijkstraFinder(); // not pleasing to eye
    // const finder = new IDAStarFinder(); // page breaking
    // const finder = new DijkstraFinder(); // not pleasing to eye
    // const finder = new BreadthFirstFinder(); // same as JumpPointFinder but too overlapping
    // const finder = new AStarFinder(); // not pleasing to eye
    // const finder = new BestFirstFinder(); // same as JumpPointFinder but not optimized

    const fullPath = finder.findPath(start.x, start.y, end.x, end.y, grid);
    // console.log("fullPath", fullPath);

    let steadyX = 0;
    let steadyY = 0;
    let breakPoints = fullPath.reduce((acc, path) => {
      let [x, y] = path || [];
      let curIdx = acc.length - 1;

      if (curIdx !== -1) {
        let [curX, curY] = acc[curIdx] || [];

        if (curX === x) {
          steadyY = y;
        } else if (curY === y) {
          steadyX = x;
        } else {
          acc.push([steadyX, steadyY]);
          steadyX = x;
          steadyY = y;
        }
      } else {
        steadyX = x;
        steadyY = y;
        acc.push(path);
      }
      return acc;
    }, []);

    let [targetX, targetY] = fullPath[fullPath.length - 1] || [];
    let [lastX, lastY] = breakPoints[breakPoints.length - 1] || [];

    if (targetX !== lastX || targetY !== lastY) {
      breakPoints.push([targetX, targetY]);
    }

    // console.log("breakPoints", breakPoints);

    steadyX = 0;
    steadyY = 0;

    const limitDrift = 5;

    let removePt = false;
    let smoothenBreakPoints = breakPoints.reduce((acc, breakPt) => {
      let [x, y] = breakPt || [];

      let curIdx = acc.length - 1;

      if (removePt) {
        if (steadyX !== 0) {
          steadyY = y;
        } else if (steadyY !== 0) {
          steadyX = x;
        }
        acc.splice(curIdx, 1, [steadyX, steadyY]);
        steadyX = 0;
        steadyY = 0;
        removePt = false;
      } else {
        if (curIdx !== -1) {
          let [curX, curY] = acc[curIdx] || [];

          if (curX - x !== 0) {
            if (curIdx !== 0 && Math.abs(curX - x) < limitDrift) {
              removePt = true;
              steadyX = curX;
              steadyY = 0;
            } else {
              acc.push(breakPt);
            }
          } else if (curY - y !== 0) {
            if (curIdx !== 0 && Math.abs(curY - y) < limitDrift) {
              removePt = true;
              steadyX = 0;
              steadyY = curY;
            } else {
              acc.push(breakPt);
            }
          }
        } else {
          acc.push(breakPt);
        }
      }
      return acc;
    }, []);

    // console.log("smoothenBreakPoints", smoothenBreakPoints);

    let smoothedFullPath = smoothenBreakPoints.reduce((acc, path) => {
      let [x, y] = path || [];
      let curIdx = acc.length - 1;

      if (curIdx !== -1) {
        let [curX, curY] = acc[curIdx] || [];

        if (curX === x) {
          if (curY < y) {
            for (let i = curY; i < y; i++) {
              acc.push([curX, i + 1]);
            }
          } else {
            for (let i = curY; i > y; i--) {
              acc.push([curX, i - 1]);
            }
          }
        } else if (curY === y) {
          if (curX < x) {
            for (let i = curX; i < x; i++) {
              acc.push([i + 1, curY]);
            }
          } else {
            for (let i = curX; i > x; i--) {
              acc.push([i - 1, curY]);
            }
          }
        }
      } else {
        acc.push(path);
      }

      return acc;
    }, []);

    // console.log("smoothedFullPath", smoothedFullPath);
    const smoothedPath = smoothedFullPath;
    // const smoothedPath = Util.smoothenPath(grid, fullPath);
    // const smoothedPath = Util.compressPath(fullPath);
    // const smoothedPath = Util.expandPath(fullPath);
    if (fullPath.length === 0 || smoothedPath.length === 0) return null;
    return { fullPath, smoothedPath };
  } catch {
    return null;
  }
};
