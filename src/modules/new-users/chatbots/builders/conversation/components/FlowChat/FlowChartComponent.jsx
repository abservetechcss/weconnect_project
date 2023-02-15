/* eslint-disable no-loop-func */
import React,{ useEffect, useState, useImperativeHandle, forwardRef } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  useViewport,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  ConnectionLineType,
  ReactFlowProvider
} from "react-flow-renderer";
import StateNode from "./stateflow/StateNode";
import SmartEdge from "./stateflow/SmartEdge";
import FloatingEdge from './stateflow/FloatingEdge.js';

import {
  nodes as initialNodes,
  edges as initialEdges,
} from "./component/initial-elements";
import { chatTypes } from "../../../../../../../variables/appVariables.jsx";
import { SmartBezierEdge, SmartStraightEdge, SmartStepEdge } from '@tisoap/react-flow-smart-edge'

const nodeTypes = { state: StateNode };
const edgeTypes = { smart: SmartEdge, SmartStepEdge: SmartStepEdge, SmartBezierEdge, FloatingEdge}
const activeEdge = "FloatingEdge";
const activeButtonEdgeType = "bezier";
const yspace = 160;
const centerPos = 250;
let yaxis = 0;
let dragging = false;
// x axis position based on button list
const buttonPos = [
  {
  0: {xaxis: 250, sourceHandle: "7", targetHandle: "7" } // middle pos
},
  {
    0: {xaxis: 100, sourceHandle: "7", targetHandle: "7" },  // left pos
    1: {xaxis: 400, sourceHandle: "7", targetHandle: "7" },  // right pos
  },
  {
    0: {xaxis: 50, sourceHandle: "4", targetHandle: "4" },  // left pos
    1: {xaxis: 250, sourceHandle: "7", targetHandle: "7" },  // middle pos
    2: {xaxis: 450, sourceHandle: "7", targetHandle: "7" },   // right pos
  }
];
const maxButtonRows = buttonPos.length;

const startStyle = {
  background: '#32E0A1',
  border: '1px solid #32E0A1',
  width: 100,
  borderRadius:"60px"
};

const endStyle = {
  background: '#959CB4',
  border: '1px solid #959CB4',
  width: 80,
  borderRadius:"22px",
  padding:"10px",
  color:"#fff"
};

const nodeStyle = {
  background: '#F2F3F5',
  border: 'none',
  width: 286,
  textAlign:"left",
  borderRadius:"6px",
  padding:"10px",
};

const buttonStyle = {
        background: '#fff',
        border: '1px solid #1E1E1E',
        width: 114,
        borderRadius:"22px",
        padding:"10px",
      };

function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).replace("_"," ");
}

function stripHtml(html)
{
  // const textContent = html.replace(/<(?!img\s*\/?)[^>]+>/g, '');
   let tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}
/**
 * Go.js is implemented using Dagre layout
 * Dagre layout means we don't define position, we just provide source & target with nodes
 * It will automatically position elements based on best available methods
 * TO Change from one library to another library, nodes & edges should always pass through common function
 */
// All nodes should pass through this mapping function to change library in future if needed
function reactFlowNode({id, label, message, pos, type}) {
  let flowStyle;
  if(type==="button")
  flowStyle = buttonStyle;
  else if(type==="start") {
    flowStyle = startStyle;
  } else if(type==="node") {
    flowStyle = nodeStyle;
  } else if(type==="end") {
    flowStyle = endStyle;
  }

  let reactLabel;
  if(typeof message==="undefined") {
    reactLabel = (
      <>
    <strong>{stripHtml(label)}</strong>
      </>
    );
  } else {
    reactLabel = (
      <>
    <strong>{label}</strong><br/>
    <p>{stripHtml(message)}</p>
      </>
    );
  }
return {
  id: id,
  type: "state",
    data: {
      label: reactLabel,
    },
    position: { x: pos.x, y: pos.y },
    style: flowStyle
  };
}

// All Edge should passt throught this mapping function to change library in future if needed
function reactFlowEdge({id, source, target, type, buttonPos, animated, sourceHandle, targetHandle}) {
  const obj = {
    id: id,
    type: type,
    source: source,
    target: target,
    sourceHandle: sourceHandle,
    targetHandle: targetHandle,
    markerEnd: {
      width: "24",
      height: "24",
     type: MarkerType.ArrowClosed
   },
  };
  if(animated) {
    obj.style = {};
    obj.animated = true;
  }
  return obj;
}

function handleAnswerOtherJump(newEdges, {id, nodeName, value}) {
  let edge = {
    id: "edge"+newEdges.length,
    source: nodeName+id,
    type: activeEdge,
  };

  if(nodeName==="node") {
    edge.sourceHandle = "7";
    edge.targetHandle = "7";
  } else {
    edge.sourceHandle = "1";
    edge.targetHandle = "2";
  }
  edge.animated = true;

  if(value===-1) {
    edge.target = "end";
    newEdges.push(reactFlowEdge(edge));
  } else if(value>0) {
    edge.target = "node"+value;
    newEdges.push(reactFlowEdge(edge));
  }
  
}
/**
 * FOr more than 3 buttons we have to equate buttons on both sides, to have proper balance between both sides of flow chart
 */
function calculateAllButtonPos(len) {
  const pos = [];
  let evenPos = centerPos; // on right side +ve numbers
  let oddPos = centerPos; // on left side -ve numbers
  for(let i=0; i<len; ++i) {
    const obj = {
      sourceHandle: "7",
      targetHandle: "7",
      xaxis: centerPos
    };
    const currentNode = i+1;
    if(currentNode===1) {
      obj.xaxis = centerPos;
      obj.sourceHandle = "1";
      obj.targetHandle = "2";
      pos.push(obj);
    } else if(currentNode%2 === 0) { // even Number
      evenPos +=200;
      obj.xaxis = evenPos;
      pos.push(obj);
    } else { // odd number
      obj.sourceHandle = "4";
      obj.targetHandle = "4";
      oddPos  -=200;
      obj.xaxis = oddPos;
      pos.unshift(obj);
    }
  }
  return pos;
} 
function addButtons(newEdges, newNodes, item,targetID) {
  yaxis += yspace;
  
  const jumpButtons = [...item.jump_to];

  if(item.answered_other_than_jump_to && item.answered_other_than_jump_to > 0) {
    jumpButtons.push({
      btn_name: "Answer Other than Above",
      type: "other",
      answered_other_than_jump_to: item.answered_other_than_jump_to
    });
  } 

  let buttonLength = jumpButtons.length;
  let allButtonPos;

  
  if(buttonLength>3) {
    allButtonPos = calculateAllButtonPos(buttonLength);
  }




  jumpButtons.forEach((myjump, i)=>{
    
    const n = i%maxButtonRows;
    const avail_rows = jumpButtons.slice(i-n,(i-n)+maxButtonRows).length;
    let currentButton = {}; 
    if(buttonLength>3) {
      currentButton = allButtonPos[i];
    } else {
      let posButton = buttonPos[avail_rows-1][n];

      currentButton = {
        xaxis: posButton.xaxis,
        sourceHandle: posButton.sourceHandle,
        targetHandle: posButton.targetHandle
      }
    }
    let label = myjump.value || myjump.jump_condition || myjump.btn_name;
    if(item.type!=="email" && item.type!=="text_question") {
    if(myjump.jump_condition && (
      myjump.jump_condition==="equal_to" ||
      myjump.jump_condition==="between" ||
      myjump.jump_condition==="between" ||
      myjump.jump_condition==="greater_than" ||
      myjump.jump_condition==="less_than"
    )) { 
      let value = myjump.value;
      if(myjump.jump_condition === "between") {
        value = myjump.from+" and "+myjump.to;
      }

      label = "("+capitalizeFirstLetter(myjump.jump_condition)+") "+value;
    }
  }
    // if(i!==0 && n===0) {
    //   yaxis += yspace;
    //   console.log("yaxis", yaxis);
    // }
    let id;
    if(myjump.id) {
      id = "btn"+myjump.id;
    } else if(myjump.type && myjump.type==="other") {
      id = "other"+item.id;
    } else {
      id = "btn_id"+myjump.btn_id;
    }

    newNodes.push(reactFlowNode({id: id, label: label, pos: { x: currentButton.xaxis, y: yaxis }, type:"button"}));
    
    // connect question to buttons
    newEdges.push(reactFlowEdge({
      id: "edge"+newEdges.length, 
      source: "node"+item.id, 
      target: id, 
      type: activeButtonEdgeType, 
      buttonPos: i+1, 
      sourceHandle: "1",
      targetHandle: "2"
    }));

    if(targetID===0) {
        newEdges.push(
          reactFlowEdge({
            id: "edge"+newEdges.length,
            source: id,
            target: "end",
            sourceHandle: "1",
            targetHandle: "2",
            type: activeButtonEdgeType, 
          }));
      }

    let target;
    let type = activeEdge;
    let animated = false;
    if(myjump.type && myjump.type==="other") {
      target = "node"+item.answered_other_than_jump_to;
      animated = true; 
    }
    else if(myjump.jump_to_question===-1) {
      target = "end";
      animated = true;
    } else if(myjump.jump_to_question==="") {
      target = "node"+targetID;
      currentButton.sourceHandle = "1";
      currentButton.targetHandle = "2";
      type = activeButtonEdgeType;
    } else {
      animated = true;
      target = "node"+myjump.jump_to_question;
    }
    // logical jump connectin for buttons
    newEdges.push(
      reactFlowEdge({
        id: "edge"+newEdges.length,
        source: id, 
        target: target, 
        animated: animated,
        type: type, 
        buttonPos: i+1, 
        sourceHandle: currentButton.sourceHandle, 
        targetHandle: currentButton.targetHandle
      })
      );
  });

  yaxis += yspace;

}

const FlowChartComponent = forwardRef((props, ref) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);


  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onLoad = (reactFlowInstance) => {
    setReactFlowInstance(reactFlowInstance);
  }

  const onInit = (reactFlowInstance) => {
    console.log("flow loaded:", reactFlowInstance);
    setReactFlowInstance(reactFlowInstance);
  }

  const fitView = () => {
      if (reactFlowInstance && nodes) {
      reactFlowInstance.fitView();
    }
  }

  useEffect(() => {
    if(dragging === false) {
      if (reactFlowInstance && nodes.length) {
        reactFlowInstance.fitView();
      }
    }
  }, [nodes, reactFlowInstance]);

  useImperativeHandle(ref, () => ({
    fitView: () => fitView(),
  }));

  useEffect(() => {
const newNodes = [reactFlowNode({id: "start", label: "Start", pos: { x: centerPos, y: yaxis }, type:"start"})];
const firstComponent = props.list[0] || {id:"start"};
const newEdges = [];


  newEdges.push(reactFlowEdge({
      id: "edge"+0,
      source: "start",
      type: "smart",
      target: "node"+firstComponent.id,
      sourceHandle: "1",
      targetHandle: "2",
  }));

  yaxis += yspace;


  for(let j=0; j< props.list.length; ++j)
  {

      const item = props.list[j];
      // let targetPosition = "top";
      
      const isEmptyJumpto = item.jump_to==="" || item.jump_to===[];

      

      newNodes.push(reactFlowNode({id: "node"+item.id, 
      label: chatTypes[item.type], 
      message: stripHtml(item.chat_message), 
      pos: { x: 158, y: yaxis }, 
      type:"node"}));

      yaxis += yspace;
    
      const nextComponent = props.list[j+1] || {id:0};
      const target = nextComponent.id;
      if(isEmptyJumpto && item.answered_other_than_jump_to==="") {
       const source = item.id;

       newEdges.push(reactFlowEdge({
        id: "edge"+newEdges.length,
        source: "node"+source,
        target: "node"+target,
        type: activeEdge, 
        sourceHandle: "1", 
        targetHandle: "2"
      }));

      if(target===0) {

        newEdges.push(
          reactFlowEdge({
            id: "edge"+newEdges.length,
            source: "node"+item.id,
            target: "end",
            sourceHandle: "1",
            targetHandle: "2",
            type: activeButtonEdgeType, 
          }));
      }

      } else{ 
        if(Array.isArray(item.jump_to) && item.jump_to.length>0) {
            addButtons(newEdges, newNodes, item, target);
            yaxis += yspace;
            console.log("yaxis", yaxis);
        } else {

          handleAnswerOtherJump(newEdges, 
            {id: item.id,
            nodeName: "node",
            target: "node"+item.answered_other_than_jump_to, 
            value: item.answered_other_than_jump_to}
            );

            // last component, ending edge
      if(target===0) {
        newEdges.push(
          reactFlowEdge({
            id: "edge"+newEdges.length,
            source: "node"+item.id,
            target: "end",
            sourceHandle: "1",
            targetHandle: "2",
            type: activeButtonEdgeType, 
          }));
      }
        }
      }
    };
    newNodes.push(reactFlowNode({id: "end", 
    label: "End Flow", 
    pos: { x: centerPos+11, y: yaxis }, type:"end"
  }));

    console.log("newNodes", newNodes);
      console.log("newEdges", newEdges);

    setNodes(newNodes);
    setEdges(newEdges);

  }, [props.list, setEdges, setNodes]);

  // console.log("nodes", nodes);
  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        // onConnect={onConnect}
        onInit={onInit}
        onLoad={onLoad}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        connectionMode="loose"
        attributionPosition="top-right"
        className="Flow"
        panOnScroll={true}
        onNodeDragStart={(_, node) => { dragging=true} }
        onNodeDragStop={(_, node) => { window.setTimeout(()=>dragging=false, 100) } }
        // defaultViewport={2}
        // snapToGrid={true}
        // defaultPosition={[0, 0]}
      >
        <MiniMap
          nodeStrokeColor={(n) => {
            if (n.style?.background) return n.style.background;
            if (n.type === "input") return "#0041d0";
            if (n.type === "output") return "#ff0072";
            if (n.type === "default") return "#1a192b";

            return "#eee";
          }}
          nodeColor={(n) => {
            if (n.style?.background) return n.style.background;

            return "#fff";
          }}
          nodeBorderRadius={2}
        />
        <Controls 
        showFitView={props.showFitView}
        onFitView={()=>{
          props.onFitView();
        }}
        />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
});

export default FlowChartComponent;
