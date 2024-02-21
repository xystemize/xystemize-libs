import { Tree } from '@nx/devkit';

export const readNxGeneratedJsonFile = ({ tree, filePath }: { tree: Tree; filePath: string }) => {
  const content = tree.read(filePath);

  if (!content) {
    return null;
  }

  return JSON.parse(content.toString('utf8'));
};

export const writeNxGeneratedJsonFile = ({
  tree,
  filePath,
  fileContent,
}: {
  tree: Tree;
  filePath: string;
  fileContent: object;
}) => {
  return tree.write(filePath, JSON.stringify(fileContent));
};

export const appendNxGeneratedJsonFile = ({
  tree,
  filePath,
  fileContent,
}: {
  tree: Tree;
  filePath: string;
  fileContent: object;
}) => {
  const json = readNxGeneratedJsonFile({ tree, filePath });

  if (!json) {
    return;
  }

  Object.assign(json, fileContent);
  writeNxGeneratedJsonFile({ tree, filePath, fileContent: json });
};
