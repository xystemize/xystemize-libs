import { names, readProjectConfiguration, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { execAsync, readNxGeneratedJsonFile } from '../../AppUtility';

import { libGenerator } from './generator';
import { LibGeneratorSchema } from './schema';

describe('lib generator', () => {
  let tree: Tree;
  const options: LibGeneratorSchema = { name: 'TestTest' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  test('libGenerator()', async () => {
    await libGenerator(tree, options);

    const libName = names(options.name).fileName;
    const config = readProjectConfiguration(tree, libName);
    expect(config).toBeDefined();

    const packageJson = readNxGeneratedJsonFile({ tree, filePath: `${libName}/package.json` });
    expect(packageJson.publishConfig).toStrictEqual({ access: 'public' });

    const projectJson = readNxGeneratedJsonFile({ tree, filePath: `${libName}/project.json` });
    expect(projectJson.release).toStrictEqual({
      executor: 'nx-release:build-update-publish',
      options: {
        libName: 'app-core',
      },
    });
  });

  test('libGenerator-e2e', async () => {
    await execAsync('npx nx generate @xystemize/app-core:lib --name=testlib --no-interactive --dry-run');
  });
});
