// @ts-nocheck
import { HttpError } from "../../../src/middleware/error-handler";

jest.mock("../../../src/repositories/task-repository", () => ({
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
  listTasks: jest.fn(),
}));

import {
  createUserTask,
  updateUserTask,
  deleteUserTask,
  listUserTasks,
} from "../../../src/services/task-service";
import {
  createTask,
  updateTask,
  deleteTask,
  listTasks,
} from "../../../src/repositories/task-repository";
import type { TaskFilters } from "../../../src/types/task-types";

const mockedCreateTask = createTask as jest.MockedFunction<typeof createTask>;
const mockedUpdateTask = updateTask as jest.MockedFunction<typeof updateTask>;
const mockedDeleteTask = deleteTask as jest.MockedFunction<typeof deleteTask>;
const mockedListTasks = listTasks as jest.MockedFunction<typeof listTasks>;

describe("task-service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, "now").mockReturnValue(new Date("2026-05-14T12:00:00.000Z").getTime());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should create a task with default values and no warning for future due date", async () => {
    // Arrange
    mockedCreateTask.mockResolvedValueOnce({
      taskId: "t-1",
      userId: "u-1",
      title: "Prepare test data",
      description: "Set up fixtures",
      status: "to-do",
      category: "work",
      priority: "medium",
      dueDate: "2026-05-20",
      createdAt: "2026-05-14T12:00:00.000Z",
      updatedAt: "2026-05-14T12:00:00.000Z",
    });

    // Act
    const result = await createUserTask("u-1", {
      title: "Prepare test data",
      description: "Set up fixtures",
      dueDate: "2026-05-20",
    });

    // Assert
    expect(mockedCreateTask).toHaveBeenCalledWith({
      userId: "u-1",
      title: "Prepare test data",
      description: "Set up fixtures",
      status: "to-do",
      category: "other",
      priority: "medium",
      dueDate: "2026-05-20",
    });
    expect(result.warning).toBeUndefined();
    expect(result.task.taskId).toBe("t-1");
  });

    it("should not warn when due date is exactly now (boundary)", async () => {
      // Arrange
      const now = new Date("2026-05-14T12:00:00.000Z").toISOString().slice(0, 10);
      mockedCreateTask.mockResolvedValueOnce({
        taskId: "t-b1",
        userId: "u-1",
        title: "Boundary now",
        description: "Due now",
        status: "to-do",
        category: "other",
        priority: "medium",
        dueDate: now,
        createdAt: "2026-05-14T12:00:00.000Z",
        updatedAt: "2026-05-14T12:00:00.000Z",
      });

      // Act
      const result = await createUserTask("u-1", {
        title: "Boundary now",
        dueDate: now,
      });

      // Assert
      expect(result.warning).toBeUndefined();
      expect(result.task.taskId).toBe("t-b1");
    });

    it("should warn when due date is just before now (boundary)", async () => {
      // Arrange
      const justBefore = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().slice(0, 10); // 1 day before
      mockedCreateTask.mockResolvedValueOnce({
        taskId: "t-b2",
        userId: "u-1",
        title: "Boundary before",
        description: "Due just before now",
        status: "to-do",
        category: "other",
        priority: "medium",
        dueDate: justBefore,
        createdAt: "2026-05-14T12:00:00.000Z",
        updatedAt: "2026-05-14T12:00:00.000Z",
      });

      // Act
      const result = await createUserTask("u-1", {
        title: "Boundary before",
        dueDate: justBefore,
      });

      // Assert
      expect(result.warning).toBe("Due date is in the past.");
      expect(result.task.taskId).toBe("t-b2");
    });

    it("should not warn when due date is just after now (boundary)", async () => {
      // Arrange
      const justAfter = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().slice(0, 10); // 1 day after
      mockedCreateTask.mockResolvedValueOnce({
        taskId: "t-b3",
        userId: "u-1",
        title: "Boundary after",
        description: "Due just after now",
        status: "to-do",
        category: "other",
        priority: "medium",
        dueDate: justAfter,
        createdAt: "2026-05-14T12:00:00.000Z",
        updatedAt: "2026-05-14T12:00:00.000Z",
      });

      // Act
      const result = await createUserTask("u-1", {
        title: "Boundary after",
        dueDate: justAfter,
      });

      // Assert
      expect(result.warning).toBeUndefined();
      expect(result.task.taskId).toBe("t-b3");
    });

  it("should include warning when creating task with due date in the past", async () => {
    // Arrange
    mockedCreateTask.mockResolvedValueOnce({
      taskId: "t-2",
      userId: "u-1",
      title: "Late task",
      description: "Past due",
      status: "to-do",
      category: "other",
      priority: "medium",
      dueDate: "2026-05-10",
      createdAt: "2026-05-14T12:00:00.000Z",
      updatedAt: "2026-05-14T12:00:00.000Z",
    });

    // Act
    const result = await createUserTask("u-1", {
      title: "Late task",
      dueDate: "2026-05-10",
    });

    // Assert
    expect(result.warning).toBe("Due date is in the past.");
    expect(result.task.taskId).toBe("t-2");
  });

  it("should throw 404 when updating a task that does not exist", async () => {
    // Arrange
    mockedUpdateTask.mockResolvedValueOnce(null);

    // Act + Assert
    await expect(updateUserTask("u-1", "missing-task", { title: "Updated" })).rejects.toEqual(
      new HttpError(404, "Task not found."),
    );
  });

  it("should update task and include warning when due date is in the past", async () => {
    // Arrange
    mockedUpdateTask.mockResolvedValueOnce({
      taskId: "t-3",
      userId: "u-1",
      title: "Updated",
      description: null,
      status: "in-progress",
      category: "work",
      priority: "high",
      dueDate: "2026-05-10",
      createdAt: "2026-05-12T12:00:00.000Z",
      updatedAt: "2026-05-14T12:00:00.000Z",
    } as never);

    // Act
    const result = await updateUserTask("u-1", "t-3", {
      title: "Updated",
      dueDate: "2026-05-10",
      status: "in-progress",
      category: "work",
      priority: "high",
    });

    // Assert
    expect(mockedUpdateTask).toHaveBeenCalledWith("t-3", "u-1", {
      title: "Updated",
      description: undefined,
      status: "in-progress",
      category: "work",
      priority: "high",
      dueDate: "2026-05-10",
    });
    expect(result.warning).toBe("Due date is in the past.");
    expect(result.task.status).toBe("in-progress");
  });

  it("should throw 404 when deleting a non-existing task", async () => {
    // Arrange
    mockedDeleteTask.mockResolvedValueOnce(false);

    // Act + Assert
    await expect(deleteUserTask("u-1", "missing-task")).rejects.toEqual(new HttpError(404, "Task not found."));
  });

  it("should not throw when deleting an existing task", async () => {
    // Arrange
    mockedDeleteTask.mockResolvedValueOnce(true);

    // Act + Assert
    await expect(deleteUserTask("u-1", "existing-task")).resolves.toBeUndefined();
    expect(mockedDeleteTask).toHaveBeenCalledWith("existing-task", "u-1");
  });

  it("should list tasks using provided filters", async () => {
    // Arrange
    const filters: TaskFilters = {
      status: ["to-do"],
      category: ["work"],
      priority: ["high"],
      dueFrom: "2026-05-01",
      dueTo: "2026-05-31",
      q: "plan",
    };

    mockedListTasks.mockResolvedValueOnce([
      {
        taskId: "t-4",
        userId: "u-1",
        title: "Plan release",
        description: "Prepare release notes",
        status: "to-do",
        category: "work",
        priority: "high",
        dueDate: "2026-05-20",
        createdAt: "2026-05-14T12:00:00.000Z",
        updatedAt: "2026-05-14T12:00:00.000Z",
      },
    ]);

    // Act
    const result = await listUserTasks("u-1", filters);

    // Assert
    expect(mockedListTasks).toHaveBeenCalledWith("u-1", filters);
    expect(result).toHaveLength(1);
    const firstTask = result[0];
    expect(firstTask).toBeDefined();
    if (firstTask) {
      expect(firstTask.title).toBe("Plan release");
    }
  });
});
