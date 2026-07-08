import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({
  path: resolve(__dirname, '../.env'),
  override: true,
  quiet: true,
});

function requireEnvVariable(envVariable: string): string {
  const envVariableValue = process.env[envVariable];
  if (!envVariableValue) {
    throw new Error(`Environment variable ${envVariable} is not set.`);
  }
  return envVariableValue;
}

export const BASE_URL = requireEnvVariable('BASE_URL');
