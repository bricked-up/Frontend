//// Mock data for boards and default issues used in CreateIssue page

import { ulid } from 'ulid';
import {
  addBoardToStore,
  getBoardFromStore,
  getBoardsFromStore,
  updateBoardDataInStore,
} from './boardsStore';

export const getBoard = (id: number) => {
  return getBoardFromStore(id);
};

export const updateBoard = (boardId: number, updatedBoard: any): boolean => {
  updateBoardDataInStore(boardId, updatedBoard);
  return true;
};