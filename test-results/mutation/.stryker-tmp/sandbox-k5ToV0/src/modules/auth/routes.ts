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
import { validateBody } from "../../middleware/validate";
import { loginUser, registerUser } from "../../services/auth-service";
import { loginSchema, registerSchema } from "../../validators/auth-validator";

/**
 * Auth module routes.
 */
export const authRouter = Router();
authRouter.post(stryMutAct_9fa48("0") ? "" : (stryCov_9fa48("0"), "/register"), validateBody(registerSchema), async (req, res) => {
  if (stryMutAct_9fa48("1")) {
    {}
  } else {
    stryCov_9fa48("1");
    const result = await registerUser(req.body);
    res.status(201).json(stryMutAct_9fa48("2") ? {} : (stryCov_9fa48("2"), {
      data: stryMutAct_9fa48("3") ? {} : (stryCov_9fa48("3"), {
        userId: result.user.userId,
        email: result.user.email,
        displayName: result.user.displayName,
        createdAt: result.user.createdAt
      }),
      meta: stryMutAct_9fa48("4") ? {} : (stryCov_9fa48("4"), {
        tokenType: result.tokenType,
        expiresIn: result.expiresIn,
        accessToken: result.accessToken
      })
    }));
  }
});
authRouter.post(stryMutAct_9fa48("5") ? "" : (stryCov_9fa48("5"), "/login"), validateBody(loginSchema), async (req, res) => {
  if (stryMutAct_9fa48("6")) {
    {}
  } else {
    stryCov_9fa48("6");
    const result = await loginUser(req.body);
    res.json(stryMutAct_9fa48("7") ? {} : (stryCov_9fa48("7"), {
      data: stryMutAct_9fa48("8") ? {} : (stryCov_9fa48("8"), {
        accessToken: result.accessToken,
        tokenType: result.tokenType,
        expiresIn: result.expiresIn,
        user: result.user
      })
    }));
  }
});
authRouter.post(stryMutAct_9fa48("9") ? "" : (stryCov_9fa48("9"), "/logout"), (_req, res) => {
  if (stryMutAct_9fa48("10")) {
    {}
  } else {
    stryCov_9fa48("10");
    res.status(204).send();
  }
});