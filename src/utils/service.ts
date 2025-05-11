// Helper services for issue operations (e.g., add, delete, update)

import { Issue } from './types';
import { getBoard, updateBoard } from './boards';

export const addTask = (issue: Issue, boardId: number) => {
  const board = getBoard(boardId);
  if (board) {
    board.issues = [...board.issues, issue];
    updateBoard(boardId, board);
    return true;
  }
  console.log('board not found');
  return false;
};

export const deleteissue = (issueId: number, boardId: number) => {
  const board = getBoard(boardId);
  if (board) {
    board.issues = board.issues.filter((issue) => issue.id !== issueId);
    updateBoard(boardId, board);
    return true;
  }
  console.log('board not found');
  return false;
};


export async function updateissue(issue: Issue, boardId: number): Promise<boolean> {
  try {
    const board = getBoard(boardId);
    if (!board) return false;

    const index = board.issues.findIndex((t) => t.id === issue.id);
    if (index !== -1) {
      board.issues[index] = issue;
      updateBoard(boardId, board);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to update issue", error);
    return false;
  }
}
