import React from 'react';
import { MarkerType } from 'react-flow-renderer';

export const nodes = [
  {
    id: '1',
    type: 'input',
    data: {
      label: (
        <>
          Start Flow2
        </>
      ),
    },
    position: { x: 250, y: 0 },
    style: {
        background: '#32E0A1',
        border: '1px solid #32E0A1',
        width: 100,
        borderRadius:"60px"
      },
  },
  {
    id: '2',
    data: {
      label: (
        <>
      <strong>Simple message</strong><br/>
      Hello!
        </>
      ),
    },
    position: { x: 158, y: 100 },
    style: {
        background: '#F2F3F5',
        border: 'none',
        width: 286,
        textAlign:"left",
        borderRadius:"6px",
        padding:"10px",
      },
  },

  {
    id: '3',
    position: { x: 158, y: 200 },
    data: {
        label: (
            <>
          <strong>Simple message</strong><br/>
          How are you?
            </>
          ),
    },
    style: {
        background: '#F2F3F5',
        border: 'none',
        width: 286,
        textAlign:"left",
        borderRadius:"6px",
        padding:"10px",
      },
  },
  {
    id: '4',
    data: {
        label: (
            <>
          <strong>Simple message</strong><br/>
          How old are you?
            </>
          ),
    },
    position: { x: 158, y: 300 },
    style: {
        background: '#F2F3F5',
        border: 'none',
        width: 286,
        textAlign:"left",
        borderRadius:"6px",
        padding:"10px",
      },
  },
  {
    id: '5',
    data: {
      label: (
        <>
         Sample button
        </>
      ),
    },
    position: { x: 100, y: 450 },
    style: {
        background: '#fff',
        border: '1px solid #1E1E1E',
        width: 114,
        borderRadius:"22px",
        padding:"10px",
      },
  },
  {
    id: '6',
    data: {  label: (
        <>
         Sample button
        </>
      ), },
    position: { x: 400, y: 450 },
    style: {
        background: '#fff',
        border: '1px solid #1E1E1E',
        width: 114,
        borderRadius:"22px",
        padding:"10px",
      },
  },

  {
    id: '7',
    type: 'output',
    data: {  label: (
        <>
      End Flow
        </>
      ), },
    position: { x: 270, y: 540 },
    style: {
        background: '#959CB4',
        border: '1px solid #959CB4',
        width: 80,
        borderRadius:"22px",
        padding:"10px",
        color:"#fff"
      },
  },
  
];

export const edges = [
  { id: 'edge1', source: '1', target: '2' },
  { id: 'edge2', source: '2', target: '3' },
  {
    id: 'edge3',
    source: '3',
    target: '4',
  },
  {
    id: 'edge4',
    source: '4',
    target: '5',
  },
  {
    id: 'edge5',
    source: '4',
    target: '6',
  },
  {
    id: 'edge6',
    source: '6',
    target: '7',
  },
  {
    id: 'edge7',
    source: '5',
    target: '7',
  },
  

];
