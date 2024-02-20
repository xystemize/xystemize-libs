import {
  formatFiles,
  generateFiles,
  installPackagesTask,
  names,
  readJson,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { LibGeneratorSchema } from './schema';
import { libraryGenerator } from '@nx/js';

export async function libGenerator(tree: Tree, options: LibGeneratorSchema) {
  const { name, directory } = options;
  const packageJson = readJson(tree, 'package.json');
  const scopeName = packageJson.scopeName ?? packageJson.name;
  const libName = names(name).fileName;
  const resolvedOptions = {
    ...options,
    name: libName,
    pascalCaseFiles: true,
    publishable: true,
    importPath: `${scopeName}/${libName}`,
  };

  let projectRoot = `libs/${libName}`;

  if (directory) {
    projectRoot = `libs/${directory}/${libName}`;
  }

  await libraryGenerator(tree, resolvedOptions);
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, resolvedOptions);
  await formatFiles(tree);

  return () => {
    installPackagesTask(tree);
  };
}

export default libGenerator;
