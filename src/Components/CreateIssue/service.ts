// Helper services for task operations (e.g., add, delete, update)

import { Task } from '../../utils/types';
import { getBoard, updateBoard } from './boards';

export const addTask = (task: Task, boardId: number) => {
  const board = getBoard(boardId);
  if (board) {
    board.tasks = [...board.tasks, task];
    updateBoard(boardId, board);
    return true;
  }
  console.log('board not found');
  return false;
};

export const deleteTask = (taskId: string, boardId: number) => {
  const board = getBoard(boardId);
  if (board) {
    board.tasks = board.tasks.filter((task) => task.id !== taskId);
    updateBoard(boardId, board);
    return true;
  }
  console.log('board not found');
  return false;
};


export async function updateTask(task: Task, boardId: number): Promise<boolean> {
  try {
    const board = getBoard(boardId);
    if (!board) return false;

    const index = board.tasks.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      board.tasks[index] = task;
      updateBoard(boardId, board);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to update task", error);
    return false;
  }
}
