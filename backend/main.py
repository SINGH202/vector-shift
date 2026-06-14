from collections import defaultdict, deque
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


class NodeModel(BaseModel):
    id: str
    data: dict[str, Any] = {}


class EdgeModel(BaseModel):
    id: str
    source: str
    target: str


class PipelinePayload(BaseModel):
    nodes: list[NodeModel]
    edges: list[EdgeModel]


def check_is_dag(nodes: list, edges: list) -> bool:
    node_ids = {node.id for node in nodes}
    if not node_ids:
        return True

    adjacency = defaultdict(list)
    in_degree = {node_id: 0 for node_id in node_ids}

    for edge in edges:
        source = edge.source
        target = edge.target
        if source not in node_ids or target not in node_ids:
            continue
        adjacency[source].append(target)
        in_degree[target] += 1

    queue = deque([node_id for node_id, degree in in_degree.items() if degree == 0])
    visited = 0

    while queue:
        current = queue.popleft()
        visited += 1
        for neighbor in adjacency[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return visited == len(node_ids)


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


@app.post('/pipelines/parse')
def parse_pipeline(payload: PipelinePayload):
    try:
        num_nodes = len(payload.nodes)
        num_edges = len(payload.edges)
        is_dag = check_is_dag(payload.nodes, payload.edges)
        return {'num_nodes': num_nodes, 'num_edges': num_edges, 'is_dag': is_dag}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
