import fs from 'node:fs';
import path from 'node:path';
import childProcess from 'node:child_process';

/**
 * Remove a file or a directory from the system
 *
 * @export
 * @param {String} path The path to the file or directory which should be removed
 */
export function rm(path) {
  fs.rmSync(path, {force: true, recursive: true});
}

/**
 * Make a recursive directory in the file system by a given path
 *
 * @export
 * @param {String} path The path which directories should be created in the file system
 */
export function mkdir(path) {
  fs.mkdirSync(path, {recursive: true});
}

/**
 * Executes a command strinig in the system
 *
 * @export
 * @param {String} cmd The command string which should be executed by the system
 */
export function exec(cmd) {
  const newCmd = cmd.replace(/\//g, path.sep);
  childProcess.execSync(newCmd, {stdio: 'inherit'});
}

/**
 * Change the mode of a file or directory
 *
 * @export
 * @param {String} path The path of a file or directory which mode should be changed
 * @param {String|Number} mode The new mode for the given path
 */
export function chmod(path, mode) {
  fs.chmodSync(path, mode);
}

/**
 * Copy the file or folder from the given soure path to the target path
 *
 * @export
 * @param {String} src The source directory path which the file or folder should be copied from
 * @param {String} dst The target directory path where the file or folder should be copied to
 */
export function cp(src, dst) {
  fs.copySync(src, dst);
}

/**
 * Change the current working directory to the given directory path
 *
 * @export
 * @param {String} dst The target directory path where the current working directory should switch to
 */
export function cd(dst) {
  process.chdir(dst);
}

export default {rm, mkdir,  exec, chmod, cp, cd};
