import { exec } from 'child_process';

export const execAsync = async (command: string) => {
  return new Promise((resolve, reject) => {
    exec(command, (err, res) => {
      if (err) {
        return reject(err);
      }

      resolve(res);
    });
  });
};
