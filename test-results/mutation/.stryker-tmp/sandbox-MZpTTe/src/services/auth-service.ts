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
import { getEnv } from "../config/env";
import { createUser, findUserByEmail } from "../repositories/user-repository";
import type { LoginInput, RegisterInput } from "../validators/auth-validator";
import { HttpError } from "../middleware/error-handler";
import { hashPassword, verifyPassword } from "../utils/password";
import { signAuthToken } from "../utils/jwt";
const env = getEnv();

/**
 * Registers a user and returns auth token with profile payload.
 */
export async function registerUser(input: RegisterInput): Promise<{
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: string;
  user: {
    userId: string;
    email: string;
    displayName: string;
    createdAt: string;
  };
}> {
  if (stryMutAct_9fa48("49")) {
    {}
  } else {
    stryCov_9fa48("49");
    const existing = await findUserByEmail(input.email);
    if (stryMutAct_9fa48("51") ? false : stryMutAct_9fa48("50") ? true : (stryCov_9fa48("50", "51"), existing)) {
      if (stryMutAct_9fa48("52")) {
        {}
      } else {
        stryCov_9fa48("52");
        throw new HttpError(409, stryMutAct_9fa48("53") ? "" : (stryCov_9fa48("53"), "Email is already registered."));
      }
    }
    const passwordHash = await hashPassword(input.password, env.bcryptSaltRounds);
    const user = await createUser(stryMutAct_9fa48("54") ? {} : (stryCov_9fa48("54"), {
      email: input.email,
      displayName: input.displayName,
      passwordHash
    }));
    const accessToken = signAuthToken(stryMutAct_9fa48("55") ? {} : (stryCov_9fa48("55"), {
      userId: user.userId,
      email: user.email,
      displayName: user.displayName
    }));
    return stryMutAct_9fa48("56") ? {} : (stryCov_9fa48("56"), {
      accessToken,
      tokenType: stryMutAct_9fa48("57") ? "" : (stryCov_9fa48("57"), "Bearer"),
      expiresIn: env.jwtExpiresIn,
      user: stryMutAct_9fa48("58") ? {} : (stryCov_9fa48("58"), {
        userId: user.userId,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt
      })
    });
  }
}

/**
 * Authenticates a user and returns a new token payload.
 */
export async function loginUser(input: LoginInput): Promise<{
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: string;
  user: {
    userId: string;
    email: string;
    displayName: string;
  };
}> {
  if (stryMutAct_9fa48("59")) {
    {}
  } else {
    stryCov_9fa48("59");
    const user = await findUserByEmail(input.email);
    if (stryMutAct_9fa48("62") ? false : stryMutAct_9fa48("61") ? true : stryMutAct_9fa48("60") ? user : (stryCov_9fa48("60", "61", "62"), !user)) {
      if (stryMutAct_9fa48("63")) {
        {}
      } else {
        stryCov_9fa48("63");
        throw new HttpError(401, stryMutAct_9fa48("64") ? "" : (stryCov_9fa48("64"), "Invalid email or password."));
      }
    }
    const isValidPassword = await verifyPassword(input.password, user.passwordHash);
    if (stryMutAct_9fa48("67") ? false : stryMutAct_9fa48("66") ? true : stryMutAct_9fa48("65") ? isValidPassword : (stryCov_9fa48("65", "66", "67"), !isValidPassword)) {
      if (stryMutAct_9fa48("68")) {
        {}
      } else {
        stryCov_9fa48("68");
        throw new HttpError(401, stryMutAct_9fa48("69") ? "" : (stryCov_9fa48("69"), "Invalid email or password."));
      }
    }
    const accessToken = signAuthToken(stryMutAct_9fa48("70") ? {} : (stryCov_9fa48("70"), {
      userId: user.userId,
      email: user.email,
      displayName: user.displayName
    }));
    return stryMutAct_9fa48("71") ? {} : (stryCov_9fa48("71"), {
      accessToken,
      tokenType: stryMutAct_9fa48("72") ? "" : (stryCov_9fa48("72"), "Bearer"),
      expiresIn: env.jwtExpiresIn,
      user: stryMutAct_9fa48("73") ? {} : (stryCov_9fa48("73"), {
        userId: user.userId,
        email: user.email,
        displayName: user.displayName
      })
    });
  }
}