import { typescript } from 'projen';
import { NodePackageManager } from 'projen/lib/javascript';

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'yarn-bound-ts',
  license: 'MIT',
  copyrightOwner: 'Yarn Community',
  projenrcTs: true,
  packageManager: NodePackageManager.NPM,
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
  bundlerOptions: {},
  gitignore: ['lib', '.idea', '.DS_Store'],
});
project.bundler.addBundle('src/index.ts', { target: 'node19', platform: 'node', outfile: 'index.js', executable: false, tsconfigPath: 'tsconfig.json', sourcemap: true });
project.eslint?.addExtends('plugin:sonarjs/recommended');
// @ts-ignore
project.eslint?.addRules({ 'sonarjs/no-duplicate-string': 'off' });

project.release!.publisher.publishToNpm();
project.synth();
