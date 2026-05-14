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
import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { validateBody, validateQuery } from "../../middleware/validate";
import { createUserTask, deleteUserTask, listUserTasks, updateUserTask } from "../../services/task-service";
import { createTaskSchema, patchTaskSchema, taskQuerySchema, type TaskQueryInput } from "../../validators/task-validator";

/**
 * Normalizes query value into a string array.
 */
function normalizeArray(value: unknown): string[] | undefined {
  if (stryMutAct_9fa48("11")) {
    {}
  } else {
    stryCov_9fa48("11");
    if (stryMutAct_9fa48("14") ? false : stryMutAct_9fa48("13") ? true : stryMutAct_9fa48("12") ? value : (stryCov_9fa48("12", "13", "14"), !value)) {
      if (stryMutAct_9fa48("15")) {
        {}
      } else {
        stryCov_9fa48("15");
        return undefined;
      }
    }
    if (stryMutAct_9fa48("17") ? false : stryMutAct_9fa48("16") ? true : (stryCov_9fa48("16", "17"), Array.isArray(value))) {
      if (stryMutAct_9fa48("18")) {
        {}
      } else {
        stryCov_9fa48("18");
        return value as string[];
      }
    }
    return stryMutAct_9fa48("19") ? [] : (stryCov_9fa48("19"), [String(value)]);
  }
}

/**
 * Task module routes.
 */
export const taskRouter = Router();
taskRouter.use(requireAuth);
taskRouter.get(stryMutAct_9fa48("20") ? "" : (stryCov_9fa48("20"), "/"), validateQuery(taskQuerySchema), async (req, res) => {
  if (stryMutAct_9fa48("21")) {
    {}
  } else {
    stryCov_9fa48("21");
    const parsedQuery = taskQuerySchema.parse(req.query) as TaskQueryInput;
    const tasks = await listUserTasks(req.user!.userId, stryMutAct_9fa48("22") ? {} : (stryCov_9fa48("22"), {
      status: normalizeArray(parsedQuery.status) as never,
      category: normalizeArray(parsedQuery.category) as never,
      priority: normalizeArray(parsedQuery.priority) as never,
      dueFrom: parsedQuery.dueFrom,
      dueTo: parsedQuery.dueTo,
      q: parsedQuery.q
    }));
    res.json(stryMutAct_9fa48("23") ? {} : (stryCov_9fa48("23"), {
      data: tasks,
      meta: stryMutAct_9fa48("24") ? {} : (stryCov_9fa48("24"), {
        total: tasks.length,
        filtersApplied: req.query
      })
    }));
  }
});
taskRouter.post(stryMutAct_9fa48("25") ? "" : (stryCov_9fa48("25"), "/"), validateBody(createTaskSchema), async (req, res) => {
  if (stryMutAct_9fa48("26")) {
    {}
  } else {
    stryCov_9fa48("26");
    const result = await createUserTask(req.user!.userId, req.body);
    res.status(201).json(stryMutAct_9fa48("27") ? {} : (stryCov_9fa48("27"), {
      data: result.task,
      warning: result.warning
    }));
  }
});
taskRouter.patch(stryMutAct_9fa48("28") ? "" : (stryCov_9fa48("28"), "/:taskId"), validateBody(patchTaskSchema), async (req, res) => {
  if (stryMutAct_9fa48("29")) {
    {}
  } else {
    stryCov_9fa48("29");
    const taskIdRaw = req.params.taskId;
    const taskId = Array.isArray(taskIdRaw) ? taskIdRaw[0] : taskIdRaw;
    if (stryMutAct_9fa48("32") ? false : stryMutAct_9fa48("31") ? true : stryMutAct_9fa48("30") ? taskId : (stryCov_9fa48("30", "31", "32"), !taskId)) {
      if (stryMutAct_9fa48("33")) {
        {}
      } else {
        stryCov_9fa48("33");
        res.status(400).json(stryMutAct_9fa48("34") ? {} : (stryCov_9fa48("34"), {
          error: stryMutAct_9fa48("35") ? {} : (stryCov_9fa48("35"), {
            code: stryMutAct_9fa48("36") ? "" : (stryCov_9fa48("36"), "HTTP_400"),
            message: stryMutAct_9fa48("37") ? "" : (stryCov_9fa48("37"), "Missing task id.")
          })
        }));
        return;
      }
    }
    const result = await updateUserTask(req.user!.userId, taskId, req.body);
    res.json(stryMutAct_9fa48("38") ? {} : (stryCov_9fa48("38"), {
      data: result.task,
      warning: result.warning
    }));
  }
});
taskRouter.delete(stryMutAct_9fa48("39") ? "" : (stryCov_9fa48("39"), "/:taskId"), async (req, res) => {
  if (stryMutAct_9fa48("40")) {
    {}
  } else {
    stryCov_9fa48("40");
    const taskIdRaw = req.params.taskId;
    const taskId = Array.isArray(taskIdRaw) ? taskIdRaw[0] : taskIdRaw;
    if (stryMutAct_9fa48("43") ? false : stryMutAct_9fa48("42") ? true : stryMutAct_9fa48("41") ? taskId : (stryCov_9fa48("41", "42", "43"), !taskId)) {
      if (stryMutAct_9fa48("44")) {
        {}
      } else {
        stryCov_9fa48("44");
        res.status(400).json(stryMutAct_9fa48("45") ? {} : (stryCov_9fa48("45"), {
          error: stryMutAct_9fa48("46") ? {} : (stryCov_9fa48("46"), {
            code: stryMutAct_9fa48("47") ? "" : (stryCov_9fa48("47"), "HTTP_400"),
            message: stryMutAct_9fa48("48") ? "" : (stryCov_9fa48("48"), "Missing task id.")
          })
        }));
        return;
      }
    }
    await deleteUserTask(req.user!.userId, taskId);
    res.status(204).send();
  }
});