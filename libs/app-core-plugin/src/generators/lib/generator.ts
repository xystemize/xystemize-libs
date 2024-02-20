import {
  formatFiles,
  generateFiles,
  installPackagesTask,
  names,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { LibGeneratorSchema } from './schema';
import { libraryGenerator } from '@nx/js';

export async function libGenerator(tree: Tree, options: LibGeneratorSchema) {
  const { name, directory } = options;
  const resolvedOptions = {
    ...options,
    name: names(name).fileName,
  };

  let projectRoot = `libs/${name}`;

  if (directory) {
    projectRoot = `libs/${directory}/${name}`;
  }

  await libraryGenerator(tree, resolvedOptions);
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, resolvedOptions);
  await formatFiles(tree);

  return () => {
    installPackagesTask(tree);
  };
}

export default libGenerator;
