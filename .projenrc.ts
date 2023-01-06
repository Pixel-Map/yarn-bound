import { typescript } from 'projen';

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'yarn-bound',
  license: 'mit',
  artifactsDirectory: 'dist',
  projenrcTs: true,
  deps: [],
  entrypoint: 'dist/yarn-bound.js',
  description: 'Quality of life wrapper around bondage.js',
  devDeps: [
    'eslint-plugin-prettier',
    'esbuild',
    'prettier',
    'eslint-plugin-sonarjs',
    'ts-node',
  ],
  tsconfig: {
    compilerOptions: {
      target: 'ES2022',
      lib: ['ES2022', 'DOM'],
    },
    include: ['.projenrc.ts'],
  },
  package: true,
  gitignore: ['/.idea', '.DS_Store'],
});

project.eslint?.addExtends('plugin:sonarjs/recommended');

project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_github.steps', [
  { uses: 'actions/setup-node@v3', with: { 'node-version': '14.x' } },
  {
    name: 'Download build artifacts',
    uses: 'actions/download-artifact@v3',
    with: { name: 'build-artifact', path: 'dist' },
  },
  {
    // eslint-disable-next-line
    name: 'Restore build artifact permissions',
    // eslint-disable-next-line
    run: 'cd dist && setfacl --restore=permissions-backup.acl',
    'continue-on-error': true,
  },
  { name: 'Get Tag', run: 'TAG=$(cat dist/releasetag.txt); echo "TAG=$TAG" >> $GITHUB_ENV' },
  {
    name: 'Release',
    uses: 'softprops/action-gh-release@v1',
    with: {
      files: 'dist/pixelmapYarnSpinner.js\ndist/pixelmapYarnSpinner.js.map',
      body_path: '${{ github.workspace }}/dist/changelog.md',
      tag_name: '${{ env.TAG }}',
    },
  },
]);

project.synth();
