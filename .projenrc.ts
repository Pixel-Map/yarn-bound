import { typescript } from 'projen';

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'yarn-bound-ts',
  license: 'MIT',
  copyrightOwner: 'Yarn Community',
  projenrcTs: true,
  deps: ['@babel/preset-env'],
  description: 'Quality of life wrapper around bondage.js',
  devDeps: ['eslint-plugin-prettier', 'esbuild', 'prettier', 'eslint-plugin-sonarjs', 'ts-node'],
  tsconfig: {
    compilerOptions: {
      target: 'ES2022',
      lib: ['ES2022', 'DOM'],
    },
  },
  release: true,
  package: true,
  gitignore: ['lib', '.idea', '.DS_Store'],
});

project.eslint?.addExtends('plugin:sonarjs/recommended');
// @ts-ignore
project.eslint?.addRules({ 'sonarjs/no-duplicate-string': 'off' });

project.release!.publisher.publishToNpm();
project.synth();
