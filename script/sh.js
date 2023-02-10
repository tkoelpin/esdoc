import fs from 'node:fs';
import path from 'node:path';
import childProcess from 'node:child_process';

export function rm(path) {
  fs.rmSync(path);
}

export function mkdir(path) {
  fs.mkdirs(path);
}

export function exec(cmd) {
  cmd = cmd.replace(/\//g, path.sep);
  childProcess.execSync(cmd, {stdio: 'inherit'});
}

export function chmod(path, mode) {
  fs.chmodSync(path, mode);
}

export function cp(src, dst) {
  fs.copySync(src, dst);
}

export function cd(dst) {
  process.chdir(dst);
}

export default {rm, mkdir,  exec, chmod, cp, cd};
