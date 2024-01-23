/* eslint-disable prettier/prettier */
import { config } from 'dotenv';
config();

export function getEnv(key: string): string {
   return process.env[key]
}
