import React, { useState } from "react";
import { Button, Box, Typography, Grid, Fade } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Board, Task } from "./types";
import { TaskCard } from "./TaskCard";
import { AddIssue } from "./AddIssue";

interface CreateTaskPageProps {
  board: Board;
}

export const mockBoard: Board = {
  id: 1,
  name: "Test Project Board",
  createdBy: "Kejsi",
  createdById: "user-1",
  createdAt: new Date(),
  tasks: [
    {
      id: "task-1",
      title: "Setup Project Repository",
      desc: "Initialize GitHub repository and push the initial commit.",
      tagid: 1,
      priority: 1,
      cost: 100,
      created: new Date("2024-04-01"),
      createdBy: "Kejsi",
      completed: undefined,
    },
    {
      id: "task-2",
      title: "Create Database Schema",
      desc: "Design and create tables for users, projects, and issues.",
      tagid: 2,
      priority: 2,
      cost: 300,
      created: new Date("2024-04-02"),
      createdBy: "Kejsi",
      completed: undefined,
    },
    {
      id: "task-3",
      title: "Implement User Authentication",
      desc: "Login, signup, password reset, and session management.",
      tagid: 3,
      priority: 1,
      cost: 250,
      created: new Date("2024-04-04"),
      createdBy: "Kejsi",
      completed: new Date("2024-04-06"),
    },
    {
      id: "task-4",
      title: "Build Issue Tracking Dashboard",
      desc: "Frontend UI to create, view, edit, and complete issues.",
      tagid: 1,
      priority: 3,
      cost: 400,
      created: new Date("2024-04-07"),
      createdBy: "Kejsi",
      completed: undefined,
    },
    {
      id: "task-5",
      title: "Deploy Application",
      desc: "Deploy backend on server and frontend on Vercel.",
      tagid: 2,
      priority: 2,
      cost: 500,
      created: new Date("2024-04-10"),
      createdBy: "Kejsi",
      completed: undefined,
    },
  ],
};

const CreateTask: React.FC<CreateTaskPageProps> = ({ board }) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(board.tasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: new Date() } : task
      )
    );
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveEdit = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setEditingTask(null);
  };

  const inProgressTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <Box
      sx={{
        height: "100vh",
        overflowY: "auto",
        paddingBottom: 4,
      }}
    >
      <Box display="flex" justifyContent="center" paddingX={4} paddingTop={3}>
        <Box display="flex" justifyContent="space-between" width="50%">
          <Typography variant="h5">{board.name}</Typography>
          <Button
            startIcon={<AddCircleOutlineIcon />}
            color="secondary"
            variant="contained"
            onClick={() => setShowAddTask(true)}
          >
            Add Issue
          </Button>
        </Box>
      </Box>

      <Fade in={true} timeout={1000}>
        <Box display="flex" justifyContent="center" padding={4}>
          <Grid container spacing={3} wrap="nowrap" maxWidth="1000px">
            <Grid item xs={12} md={6} lg={5}>
              <Typography variant="h6" textAlign="center" gutterBottom>
                In Progress
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {inProgressTasks.length > 0 ? (
                  inProgressTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      boardId={board.id}
                      onDelete={handleDeleteTask}
                      onComplete={handleCompleteTask}
                      onEdit={handleEditTask}
                    />
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    textAlign="center"
                    color="text.secondary"
                  >
                    No tasks
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={6} lg={5}>
              <Typography variant="h6" textAlign="center" gutterBottom>
                Completed
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {completedTasks.length > 0 ? (
                  completedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      boardId={board.id}
                      onDelete={handleDeleteTask}
                      onComplete={handleCompleteTask}
                      onEdit={handleEditTask}
                    />
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    textAlign="center"
                    color="text.secondary"
                  >
                    No completed tasks
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Fade>

      {showAddTask && (
        <AddIssue
          show={showAddTask}
          onClose={() => setShowAddTask(false)}
          boardId={board.id}
          onAdd={handleAddTask}
        />
      )}

      {editingTask && (
        <AddIssue
          show={!!editingTask}
          onClose={() => setEditingTask(null)}
          boardId={board.id}
          onAdd={handleSaveEdit}
          initialData={editingTask}
        />
      )}
    </Box>
  );
};

export default CreateTask;
