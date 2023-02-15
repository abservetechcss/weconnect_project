import { useCallback } from 'react';
import { useStore, useNodes, getBezierPath } from 'react-flow-renderer';
import { getSmartEdge } from '@tisoap/react-flow-smart-edge'

import { getEdgeParams } from './utils.js';

function FloatingEdge({ id, source, target, markerEnd, style }) {
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));
  const nodes = useNodes()

  if (!sourceNode || !targetNode) {
    return null;
  }
  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);
let d;
  let getSmartEdgeResponse = getSmartEdge({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
    nodes
  });
  if(getSmartEdgeResponse===null) {
    d = getBezierPath({
        sourceX: sx,
        sourceY: sy,
        sourcePosition: sourcePos,
        targetPosition: targetPos,
        targetX: tx,
        targetY: ty,
      });
  } else {
    const { svgPathString } = getSmartEdgeResponse
    d = svgPathString;
  }

  return (
    <g className="react-flow__connection">
      <path id={id} className="react-flow__edge-path" d={d} markerEnd={markerEnd} style={style} />
    </g>
  );
}

export default FloatingEdge;
