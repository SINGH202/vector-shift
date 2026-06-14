import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from './store';
import { nodeTypes } from './nodes/registry';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
};

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      getNodeID: state.getNodeID,
      addNode: state.addNode,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
    })),
  );

  const getInitNodeData = (nodeID, type) => {
    const base = { id: nodeID, nodeType: `${type}` };
    if (type === 'text') {
      return { ...base, text: '{{input}}' };
    }
    return base;
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }

      const rawData = event.dataTransfer.getData('application/reactflow');
      if (!rawData) {
        return;
      }

      let appData;
      try {
        appData = JSON.parse(rawData);
      } catch {
        return;
      }

      const type = appData?.nodeType;
      if (!type) {
        return;
      }

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const nodeID = getNodeID(type);
      const newNode = {
        id: nodeID,
        type,
        position,
        data: getInitNodeData(nodeID, type),
      };

      addNode(newNode);
    },
    [reactFlowInstance, getNodeID, addNode],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div
      ref={reactFlowWrapper}
      className="h-full w-full"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
        elevateNodesOnSelect
        autoPanOnConnect
        autoPanOnNodeDrag
        deleteKeyCode={['Backspace', 'Delete']}
        defaultEdgeOptions={defaultEdgeOptions}
      >
        <Background color="#2d3748" gap={gridSize} />
        <Controls />
        <MiniMap nodeColor="#513dd9" maskColor="rgba(15, 20, 25, 0.8)" />
      </ReactFlow>
    </div>
  );
};
