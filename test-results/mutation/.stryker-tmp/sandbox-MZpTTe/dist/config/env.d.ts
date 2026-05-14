/**
 * Strongly typed runtime environment configuration.
 */
// @ts-nocheck

export interface AppEnv {
    port: number;
    databaseUrl: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    bcryptSaltRounds: number;
    clientOrigin: string;
}
/**
 * Returns validated environment variables for the API.
 */
export declare function getEnv(): AppEnv;
//# sourceMappingURL=env.d.ts.map