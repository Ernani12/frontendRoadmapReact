import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  applyEdgeChanges,
} from "reactflow";
import { useLocation } from "react-router-dom";
import "reactflow/dist/style.css";
import "./map.css";

// Função para mapear cores de acordo com o nível
const getColorByLevel = (level) => {
  switch (level) {
    case "pouco":
      return "red";
    case "basico":
      return "yellow";
    case "muito":
      return "blue";
    case "experiente":
      return "green";
    default:
      return "#9999"; // Cor padrão se o nível não for definido
  }
};

export const saveMindMap = (nodes, edges) => {
  const data = { nodes, edges };
  localStorage.setItem("mindMapData", JSON.stringify(data));
};

export const loadMindMap = () => {
  const data = localStorage.getItem("mindMapData");
  return data ? JSON.parse(data) : null;
};

const initialNodes = [];
const initialEdges = [];

export default function MindNode() {
  const location = useLocation();
  const unselectedSkills = location.state?.unselectedSkills || [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [name, setName] = useState("");
  const [selectedEdge, setSelectedEdge] = useState(null);

  useEffect(() => {
    if (unselectedSkills.length > 0) {
      const skillNodes = unselectedSkills.map((skill, index) => ({
        id: (index + 2).toString(),
        data: { label: skill.nome },
        position: {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        },
        style: { border: `5px solid ${getColorByLevel(skill.level)}` }, // Definindo a cor da borda
      }));
      setNodes((nodes) => nodes.concat(skillNodes));
    }
  }, [unselectedSkills]);

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

  const onEdgesChangeWithSelection = useCallback(
    (changes) => {
      const change = changes.find((c) => c.type === "select");
      if (change && change.selected) {
        setSelectedEdge(change);
      }
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
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

  useEffect(() => {
    const handleDelete = (event) => {
      if (event.key === "Delete" && selectedEdge) {
        setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id));
        setSelectedEdge(null);
      }
    };

    document.addEventListener("keydown", handleDelete);
    return () => {
      document.removeEventListener("keydown", handleDelete);
    };
  }, [selectedEdge]);

  const connectionLineStyle = {
    stroke: "#9999",
    strokeWidth: 3,
  };

  const defaultEdgeOptions = { style: connectionLineStyle, type: "mindmap" };

  return (
    <div className="fundo">
      <div id="container1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChangeWithSelection}
          connectionLineStyle={connectionLineStyle}
          defaultEdgeOptions={defaultEdgeOptions}
          onConnect={onConnect}
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
    </div>
  );
}
