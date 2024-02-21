import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, names, readProjectConfiguration } from '@nx/devkit';

import { libGenerator } from './generator';
import { LibGeneratorSchema } from './schema';
import { readJsonFile } from '../utils/File';

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

    const packageJson = readJsonFile({ tree, filePath: `${libName}/package.json`});
    expect(packageJson.publishConfig).toStrictEqual({ access: 'public' });

    const projectJson = readJsonFile({ tree, filePath: `${libName}/project.json`});
    expect(projectJson.release).toStrictEqual({
      executor: "nx-release:build-update-publish",
      options: {
        libName: "app-core"
      }
    });
  });
});
