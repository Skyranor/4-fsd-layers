import { nanoid } from "nanoid";
import { create } from "zustand";
import { taskRepository } from "./tasks.repository";
import { Task } from "./types";

export type TasksStore = {
	tasks: Task[];
	getTaskById: (id: string) => Task | undefined;
	loadTasks: () => Promise<void>;
	createTask: (data: Task) => Promise<void>;
	updateTask: (id: string, data: Task) => Promise<void>;
	removeTask: (taskId: string) => Promise<void>;
}

export const useTasks = create<TasksStore>((set, get) => ({
	tasks: [],
	getTaskById: (id) => {
		return get().tasks.find((task) => task.id === id);
	},
	loadTasks: async () => {
		set({
			tasks: await taskRepository.getTasks(),
		})
	},
	createTask: async (data) => {
		const newTask = { ...data, id: nanoid(), };

		await taskRepository.saveTask(newTask);
		set({
			tasks: await taskRepository.getTasks(),
		})
	},
	updateTask: async (id, data) => {
		const task = await taskRepository.getTask(id)
		if (!task) return;
		const newTask = { ...task, ...data };
		await taskRepository.saveTask(newTask);
		set({
			tasks: await taskRepository.getTasks()
		})
	},

	removeTask: async (taskId) => {
		await taskRepository.removeTask(taskId);
		set({
			tasks: await taskRepository.getTasks()
		})
	}
}
))
