import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  applyEdgeChanges,
} from "reactflow";
import { useLocation } from "react-router-dom";
import "reactflow/dist/style.css";
import "./map.css";
import { v4 as uuidv4 } from 'uuid'; // Importar UUID para gerar IDs únicos

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

// Funções para salvar e carregar o Mind Map no Local Storage
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
    data: { label: "Início" },
    position: { x: 250, y: 5 },
    style: { border: "5px solid black" },
  },
];
const initialEdges = [];

export default function MindNode() {
  const location = useLocation();
  const unselectedSkills = location.state?.unselectedSkills || [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [name, setName] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null); // Adicionar estado para o edge selecionado

  useEffect(() => {
    if (unselectedSkills.length > 0) {
      const existingNodeIds = nodes.map(node => node.id);
      const existingEdgeIds = edges.map(edge => edge.id);

      const newNodes = unselectedSkills
        .filter(skill => !existingNodeIds.includes(skill.id)) // Adicione uma propriedade `id` em skills
        .map((skill, index) => ({
          id: uuidv4(), // Usar UUID para IDs únicos
          data: { label: skill.nome },
          position: {
            x: 250 + index * 200,
            y: 100 + index * 100,
          },
          style: { border: `5px solid ${getColorByLevel(skill.level)}` },
        }));

      const newEdges = newNodes.map((node, index) => ({
        id: uuidv4(), // Usar UUID para IDs únicos
        source: index === 0 ? "1" : newNodes[index - 1].id,
        target: node.id,
        type: "smoothstep",
      })).filter(edge => !existingEdgeIds.includes(edge.id));

      setNodes((nodes) => [...nodes, ...newNodes]);
      setEdges((edges) => [...edges, ...newEdges]);
    }
  }, [unselectedSkills]);

  const addNode = () => {
    setNodes((e) =>
      e.concat({
        id: uuidv4(), // Usar UUID para IDs únicos
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
      setEdges((eds) =>
        applyEdgeChanges(changes, eds).map((edge) => {
          const isSelected = edge.id === selectedEdge?.id;
          return {
            ...edge,
            className: isSelected ? "selected" : "",
          };
        })
      );
    },
    [setEdges, selectedEdge]
  );

  const onNodeClick = useCallback(
    (event, node) => {
      setSelectedNode(node);
      setSelectedEdge(null); // Desmarcar aresta selecionada ao clicar em um nó
    },
    []
  );

  const onEdgeClick = useCallback(
    (event, edge) => {
      setSelectedNode(null); // Desmarcar nó selecionado ao clicar em um edge
      setSelectedEdge(edge); // Atualizar o estado do edge selecionado
    },
    []
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

  const deleteNodeAndEdges = () => {
    if (selectedNode) {
      // Remover o nó selecionado
      setNodes((nodes) => nodes.filter((node) => node.id !== selectedNode.id));
      
      // Remover arestas conectadas ao nó selecionado
      setEdges((edges) => edges.filter(
        (edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id
      ));
      
      setSelectedNode(null);
      setSelectedEdge(null); // Limpar seleção de edge ao remover nó
    }
  };

  useEffect(() => {
    const handleDelete = (event) => {
      if (event.key === "Delete" && (selectedNode || selectedEdge)) {
        if (selectedNode) {
          deleteNodeAndEdges();
        } else if (selectedEdge) {
          setEdges((edges) => edges.filter(edge => edge.id !== selectedEdge.id));
          setSelectedEdge(null); // Limpar seleção de edge após a exclusão
        }
      }
    };

    document.addEventListener("keydown", handleDelete);
    return () => {
      document.removeEventListener("keydown", handleDelete);
    };
  }, [selectedNode, selectedEdge]);

  const connectionLineStyle = {
    stroke: "#9999",
    strokeWidth: 3,
  };

  const defaultEdgeOptions = { style: connectionLineStyle, type: "smoothstep" };

  return (
    <div className="fundo">
      <div id="container1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChangeWithSelection}
          onEdgeClick={onEdgeClick}
          onNodeClick={onNodeClick}
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
          <button id="five" onClick={deleteNodeAndEdges}>
            Delete Selected Node
          </button>
        </div>
      </div>
    </div>
  );
}
