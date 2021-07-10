import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra } from "./algorithms/dijkstra";
import { closestpath } from "./algorithms/dijkstra";

const Start_Node_Row = 10;
const Finish_Node_Row = 10;
const Start_Node_Col = 10;
const Finish_Node_Col = 40;

export default class PathFinder extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      isMousePressed: false,
    };
  }
  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }
  handleMouseDown(row, col) {
    const grid = getWallToggledGrid(this.state.grid, row, col);
    this.setState({ grid: grid, isMousePressed: true });
  }
  handleMouseEnter(row, col) {
    if (this.state.isMousePressed === false) return;
    const grid = getWallToggledGrid(this.state.grid, row, col);
    this.setState({ grid: grid });
  }
  handleMouseUp() {
    this.setState({ isMousePressed: false });
  }
  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[Start_Node_Row][Start_Node_Col];
    const FinishNode = grid[Finish_Node_Row][Finish_Node_Col];
    const NodesInorder = dijkstra(grid, startNode, FinishNode);
    const ClosestPath = closestpath(FinishNode);
    this.animateDijistra(NodesInorder, ClosestPath);
  }
  animateDijistra(NodesInorder, ClosestPath) {
    for (let i = 0; i <= NodesInorder.length; i++) {
      if (i === NodesInorder.length) {
        setTimeout(() => {
          this.animateShortestPath(ClosestPath);
        }, 10*i);
        return;
      }
      setTimeout(() => {
        const node = NodesInorder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10*i);
    }
  }
  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {col, row, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

function getInitialGrid() {
  const grid = [];
  let row = 20;
  let col = 50;
  for (let i = 0; i < row; i++) {
    const currentRow = [];
    for (let j = 0; j < col; j++) {
      currentRow.push(createNode(i, j));
    }
    grid.push(currentRow);
  }
  return grid;
}

const createNode = (row, col) => {
  return {
    row,
    col,
    isStart: row === Start_Node_Row && col === Start_Node_Col,
    isFinish: row === Finish_Node_Row && col === Finish_Node_Col,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

function getWallToggledGrid(grid, row, col) {
  const node = grid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  grid[row][col] = newNode;
  return grid;
}
