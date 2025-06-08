/**
 * Interface for the environment variables
 */
export interface EnvironmentInterface {
  production: boolean;
  name: string;
  apiPort?: number;
  apiPath: string;
}
