import {
    Tree} from '@nx/devkit';

export const readJsonFile = ({ tree, filePath }: { tree: Tree, filePath: string; }) => {
    return JSON.parse(tree.read(filePath).toString('utf8'));
};

export const writeJsonFile = ({ tree, filePath, fileContent }: { tree: Tree, filePath: string; fileContent: object }) => {
    return tree.write(filePath, JSON.stringify(fileContent));
};

export const appendJsonFile = ({ tree, filePath, fileContent }: { tree: Tree, filePath: string; fileContent: object }) => {
    const json = readJsonFile({ tree, filePath });
    Object.assign(json, fileContent)

  writeJsonFile({ tree, filePath, fileContent: json });
};