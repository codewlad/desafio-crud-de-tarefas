import path from "node:path";
import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-rout-path.js";

const database = new Database();

export const routes = [
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title: title,
        description: description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );

      return res.writeHead(200).end(JSON.stringify(tasks));
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const tasks = database.select("tasks");
      const taskIndex = tasks.findIndex((task) => task.id === id);

      if (taskIndex === -1) {
        return res.writeHead(404).end();
      }

      const { completed_at, created_at } = tasks[taskIndex];

      database.update("tasks", id, {
        title,
        description,
        completed_at,
        created_at,
        updated_at: new Date(),
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const tasks = database.select("tasks");
      const taskIndex = tasks.findIndex((task) => task.id === id);
      if (taskIndex === -1) {
        return res.writeHead(404).end();
      }

      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/completed"),
    handler: (req, res) => {
      const { id } = req.params;

      const tasks = database.select("tasks");
      const taskIndex = tasks.findIndex((task) => task.id === id);

      console.log("Id:", id);
      console.log("Tasks:", tasks);
      console.log("Task Index:", taskIndex);

      if (taskIndex === -1) {
        return res.writeHead(404).end();
      }

      const { title, description, created_at } = tasks[taskIndex];

      database.update("tasks", id, {
        title,
        description,
        completed_at: new Date(),
        created_at,
        updated_at: new Date(),
      });

      return res.writeHead(204).end();
    },
  },
];
