import process from 'node:process';
import { runTool } from './tool';

const { code, stdout, stderr } = await runTool(process.argv.slice(2));

if (stdout) process.stdout.write(`${stdout}\n`);
if (stderr) process.stderr.write(`${stderr}\n`);

process.exitCode = code;
