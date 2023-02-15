import React from "react";
import { useNodes, SmoothStepEdge, EdgeText } from "react-flow-renderer";
// import {
//   getSmartEdge,
//   pathfindingJumpPointNoDiagonal,
//   // pathfindingAStarNoDiagonal,
//   // pathfindingAStarDiagonal,
//   svgDrawSmoothLinePath
//   // svgDrawStraightLinePath
// } from "@tisoap/react-flow-smart-edge";
import { getSmartEdge } from "../pathFinding/getSmartEdge";
import { edgePaths } from "./EdgeUtils";

export default function SmartEdge(props, onEdgePathUpdate) {
  const {
    id,
    sourcePosition,
    targetPosition,
    sourceX,
    sourceY,
    targetX,
    targetY,
    style,
    markerStart,
    markerEnd,
    // centerX,
    // centerY,
    label,
    labelStyle,
    labelShowBg,
    labelBgStyle,
    labelBgPadding,
    labelBgBorderRadius
  } = props;

  const nodes = useNodes();
  // console.log("Nodes from UseNode", nodes);

  const currentEdgePathIndex = edgePaths.getEdgePathIndex(id);
  let currentEdgePaths = edgePaths.getEdgePaths();
  // console.log("EdgePaths", currentEdgePaths);

  if (currentEdgePathIndex !== null) {
    currentEdgePaths = currentEdgePaths.slice(0, currentEdgePathIndex);
    // console.log("EdgePaths", currentEdgePaths);
  }

  const getSmartEdgeResponse = getSmartEdge({
    sourcePosition,
    targetPosition,
    sourceX,
    sourceY,
    targetX,
    targetY,
    nodes,
    edgesPath: currentEdgePaths,
    options: {
      nodePadding: 20,
      edgePadding: 3, //edgePadding => mutiple of gridRatio
      gridRatio: 5
    }
  });

  let { smoothedPath, graphPath } = getSmartEdgeResponse || {};
//   console.log(
//     "smoothedPath",
//     id,
//     [sourceX, sourceY],
//     [targetX, targetY]
//     // smoothedPath,
//     // graphPath
//   );

  edgePaths.setEdgePaths({ id, smoothedPath, graphPath });

  // If the value returned is null, it means "getSmartEdge" was unable to find
  // a valid path, and you should do something else instead
  if (getSmartEdgeResponse === null) {
    // console.log("Failed to get smart Edge", id);
    return <SmoothStepEdge {...props} />;
  }

  const index = Math.floor(graphPath.length / 2);
  const middlePoint = graphPath[index];
  const [middleX, middleY] = middlePoint;

  const { edgeCenterX, edgeCenterY, svgPathString } = getSmartEdgeResponse;
//   console.log("Center points for tags", edgeCenterX, edgeCenterY);

  return (
    <>
      <path
        id={id}
        style={style}
        d={svgPathString}
        className="react-flow__edge-path"
        markerEnd={markerEnd}
        markerStart={markerStart}
      />
      <EdgeText
        x={middleX}
        y={middleY}
        label={label}
        labelStyle={labelStyle}
        labelShowBg={labelShowBg}
        labelBgStyle={labelBgStyle}
        labelBgPadding={labelBgPadding}
        labelBgBorderRadius={labelBgBorderRadius}
      />
    </>
  );
}
