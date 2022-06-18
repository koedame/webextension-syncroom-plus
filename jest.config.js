/** @type {import('@swc/core').Config} */
const swcConfig = {
  // ソースマップの出力を有効にする
  sourceMaps: true,
  module: {
    // JestがCommonJSでモジュールを読み込むのでCommonJS形式で出力する
    type: 'commonjs',
  },
  jsc: {
    parser: {
      // TypeScriptとしてコンパイルする
      syntax: 'typescript',
      // Reactのコンポーネントをテストしたいのでtsxのコンパイルを有効化
      tsx: true,
    },
    transform: {
      react: {
        // React の JSX トランスフォームの指定
        // Reactインポートの手間を省略するために React17 から導入された
        // _jsx(react/jsx-runtime) の形式にコンパイルする
        runtime: 'automatic',
      },
    },
  },
};

module.exports = {
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'js', 'tsx'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    // '^.+\\.(jsx|tsx|ts|js)?$': 'ts-jest',
    '^.+\\.(t|j)sx?$': ['@swc/jest', swcConfig],
  },
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/{lib}/**/*.{js,jsx,ts,tsx}'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
