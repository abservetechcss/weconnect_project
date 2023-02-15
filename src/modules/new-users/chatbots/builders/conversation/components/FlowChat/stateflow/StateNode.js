import React from "react";
import { Handle, Position } from "react-flow-renderer";



export default function StateNode({ data }) {
  return (
    <>
      <Handle type="source" position={Position.Left} id="3" style={{top: "16.8%"}}/>
      <Handle type="source" position={Position.Left} id="4" />
      <Handle type="source" position={Position.Left} id="5" style={{top: "79.2%"}}/>

     <Handle
        type="source"
        position={Position.Top}
        id="2"
        style={{ left: "50%" }}
      />
      <Handle type="source" position={Position.Right} id="6" style={{top: "16.8%"}}/>
      <Handle type="source" position={Position.Right} id="7" />
      <Handle type="source" position={Position.Right} id="8" style={{top: "79.2%"}}/>

      <div> {data.label} </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="1"
        style={{ left: "50%" }}
      />

    </>
  );
}
