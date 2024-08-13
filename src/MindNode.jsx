import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
} from "reactflow";
import "reactflow/dist/style.css";
import './map.css'; // Importe o arquivo de estilo


export const saveMindMap = (nodes, edges) => {
  const data = { nodes, edges };
  localStorage.setItem("mindMapData", JSON.stringify(data));
};

export const loadMindMap = () => {
  const data = localStorage.getItem("mindMapData");
  return data ? JSON.parse(data) : null;
};

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Mind Map" },
    position: { x: 0, y: 0 },
    style: { border: "20px solid #9999" },
  },
];
const initialEdges = [];
const onLoad = (reactFlowInstance) => {
  reactFlowInstance.fitView();
};

export default function MindNode() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [name, setName] = useState("");

  const addNode = () => {
    setNodes((e) =>
      e.concat({
        id: (e.length + 1).toString(),
        data: { label: `${name}` },
        position: {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        },
        style: { border: "10px solid #9999" },
      })
    );
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  const handleSaveClick = () => {
    saveMindMap(nodes, edges);
    console.log(nodes);
  };
  const handleLoadClick = () => {
    const loadedData = loadMindMap();
    if (loadedData) {
      setNodes(loadedData.nodes);
      setEdges(loadedData.edges);
      console.log(loadedData);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };
  // const nodeOrigin = [0.5, 0.5];
  const connectionLineStyle = {
    stroke: "#9999",
    strokeWidth: 3,
    
  };
  const defaultEdgeOptions = { style: connectionLineStyle, type: "mindmap" };

  return (
    <div id="container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionLineStyle={connectionLineStyle}
        defaultEdgeOptions={defaultEdgeOptions}
        onConnect={onConnect}
        onLoad={onLoad}
      >
        <Controls />
    
      </ReactFlow>
      <div>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          name="title"
        />
        <button id="one" type="button" onClick={addNode}>
          Add Node
        </button>
      </div>
      <div>
        <button id="two" onClick={handleSaveClick}>
          Save Mind Map
        </button>
        <button id="three" onClick={handleLoadClick}>
          Load Mind Map
        </button>
        <button id="four" onClick={refreshPage}>
          Refresh
        </button>
      </div>
    </div>
  );
}