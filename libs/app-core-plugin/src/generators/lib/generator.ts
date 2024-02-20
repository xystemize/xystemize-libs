import {
  addProjectConfiguration,
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
  const resolvedOptions = {
    ...options,
    name: names(options.name).fileName,
  };
  const projectRoot = `libs/${options.name}`;
  
  await libraryGenerator(tree, { name: resolvedOptions.name });
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, resolvedOptions);
  await formatFiles(tree);

  return () => {
    installPackagesTask(tree);
  };
}

export default libGenerator;
