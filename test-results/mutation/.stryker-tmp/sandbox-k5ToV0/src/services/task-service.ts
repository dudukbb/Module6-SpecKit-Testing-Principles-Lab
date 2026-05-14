// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { createTask, deleteTask, listTasks, updateTask } from "../repositories/task-repository";
import { HttpError } from "../middleware/error-handler";
import type { TaskFilters } from "../types/task-types";
import type { CreateTaskInput, PatchTaskInput } from "../validators/task-validator";

/**
 * Creates a task and emits due-date warning when applicable.
 */
export async function createUserTask(userId: string, input: CreateTaskInput): Promise<{
  task: Awaited<ReturnType<typeof createTask>>;
  warning?: string;
}> {
  if (stryMutAct_9fa48("74")) {
    {}
  } else {
    stryCov_9fa48("74");
    const dueDateWarning = (stryMutAct_9fa48("77") ? input.dueDate || new Date(input.dueDate).getTime() < Date.now() : stryMutAct_9fa48("76") ? false : stryMutAct_9fa48("75") ? true : (stryCov_9fa48("75", "76", "77"), input.dueDate && (stryMutAct_9fa48("80") ? new Date(input.dueDate).getTime() >= Date.now() : stryMutAct_9fa48("79") ? new Date(input.dueDate).getTime() <= Date.now() : stryMutAct_9fa48("78") ? true : (stryCov_9fa48("78", "79", "80"), new Date(input.dueDate).getTime() < Date.now())))) ? stryMutAct_9fa48("81") ? "" : (stryCov_9fa48("81"), "Due date is in the past.") : undefined;
    const task = await createTask(stryMutAct_9fa48("82") ? {} : (stryCov_9fa48("82"), {
      userId,
      title: input.title,
      description: input.description,
      status: stryMutAct_9fa48("83") ? input.status && "to-do" : (stryCov_9fa48("83"), input.status ?? (stryMutAct_9fa48("84") ? "" : (stryCov_9fa48("84"), "to-do"))),
      category: stryMutAct_9fa48("85") ? input.category && "other" : (stryCov_9fa48("85"), input.category ?? (stryMutAct_9fa48("86") ? "" : (stryCov_9fa48("86"), "other"))),
      priority: stryMutAct_9fa48("87") ? input.priority && "medium" : (stryCov_9fa48("87"), input.priority ?? (stryMutAct_9fa48("88") ? "" : (stryCov_9fa48("88"), "medium"))),
      dueDate: input.dueDate
    }));
    if (stryMutAct_9fa48("90") ? false : stryMutAct_9fa48("89") ? true : (stryCov_9fa48("89", "90"), dueDateWarning)) {
      if (stryMutAct_9fa48("91")) {
        {}
      } else {
        stryCov_9fa48("91");
        return stryMutAct_9fa48("92") ? {} : (stryCov_9fa48("92"), {
          task,
          warning: dueDateWarning
        });
      }
    }
    return stryMutAct_9fa48("93") ? {} : (stryCov_9fa48("93"), {
      task
    });
  }
}

/**
 * Updates a user task and emits due-date warning when applicable.
 */
export async function updateUserTask(userId: string, taskId: string, input: PatchTaskInput): Promise<{
  task: NonNullable<Awaited<ReturnType<typeof updateTask>>>;
  warning?: string;
}> {
  if (stryMutAct_9fa48("94")) {
    {}
  } else {
    stryCov_9fa48("94");
    const dueDateWarning = (stryMutAct_9fa48("97") ? input.dueDate || new Date(input.dueDate).getTime() < Date.now() : stryMutAct_9fa48("96") ? false : stryMutAct_9fa48("95") ? true : (stryCov_9fa48("95", "96", "97"), input.dueDate && (stryMutAct_9fa48("100") ? new Date(input.dueDate).getTime() >= Date.now() : stryMutAct_9fa48("99") ? new Date(input.dueDate).getTime() <= Date.now() : stryMutAct_9fa48("98") ? true : (stryCov_9fa48("98", "99", "100"), new Date(input.dueDate).getTime() < Date.now())))) ? stryMutAct_9fa48("101") ? "" : (stryCov_9fa48("101"), "Due date is in the past.") : undefined;
    const task = await updateTask(taskId, userId, stryMutAct_9fa48("102") ? {} : (stryCov_9fa48("102"), {
      title: input.title,
      description: input.description,
      status: input.status,
      category: input.category,
      priority: input.priority,
      dueDate: input.dueDate
    }));
    if (stryMutAct_9fa48("105") ? false : stryMutAct_9fa48("104") ? true : stryMutAct_9fa48("103") ? task : (stryCov_9fa48("103", "104", "105"), !task)) {
      if (stryMutAct_9fa48("106")) {
        {}
      } else {
        stryCov_9fa48("106");
        throw new HttpError(404, stryMutAct_9fa48("107") ? "" : (stryCov_9fa48("107"), "Task not found."));
      }
    }
    if (stryMutAct_9fa48("109") ? false : stryMutAct_9fa48("108") ? true : (stryCov_9fa48("108", "109"), dueDateWarning)) {
      if (stryMutAct_9fa48("110")) {
        {}
      } else {
        stryCov_9fa48("110");
        return stryMutAct_9fa48("111") ? {} : (stryCov_9fa48("111"), {
          task,
          warning: dueDateWarning
        });
      }
    }
    return stryMutAct_9fa48("112") ? {} : (stryCov_9fa48("112"), {
      task
    });
  }
}

/**
 * Deletes a task by id and owner.
 */
export async function deleteUserTask(userId: string, taskId: string): Promise<void> {
  if (stryMutAct_9fa48("113")) {
    {}
  } else {
    stryCov_9fa48("113");
    const deleted = await deleteTask(taskId, userId);
    if (stryMutAct_9fa48("116") ? false : stryMutAct_9fa48("115") ? true : stryMutAct_9fa48("114") ? deleted : (stryCov_9fa48("114", "115", "116"), !deleted)) {
      if (stryMutAct_9fa48("117")) {
        {}
      } else {
        stryCov_9fa48("117");
        throw new HttpError(404, stryMutAct_9fa48("118") ? "" : (stryCov_9fa48("118"), "Task not found."));
      }
    }
  }
}

/**
 * Lists tasks using AND-based filter semantics.
 */
export async function listUserTasks(userId: string, filters: TaskFilters) {
  if (stryMutAct_9fa48("119")) {
    {}
  } else {
    stryCov_9fa48("119");
    return listTasks(userId, filters);
  }
}