{
  "name": "create-portal-app",
  "version": "0.0.3",
  "description": "Production ready starter for portal app project",
  "files": [
    "dist"
  ],
  "bin": "dist/setup.js",
  "scripts": {
    "start": "umi dev",
    "build": "umi build",
    "postinstall": "umi generate tmp",
    "prettier": "prettier --write '**/*.{js,jsx,tsx,ts,less,md,json}'",
    "test": "umi-test",
    "test:coverage": "umi-test --coverage"
  },
  "gitHooks": {
    "pre-commit": "lint-staged"
  },
  "lint-staged": {
    "*.{js,jsx,less,md,json}": [
      "prettier --write"
    ],
    "*.ts?(x)": [
      "prettier --parser=typescript --write"
    ]
  },
  "dependencies": {
    "@ant-design/pro-layout": "^6.5.0",
    "@umijs/preset-react": "1.x",
    "umi": "^3.4.25",
    "k2-portal": "^{{{ version }}}"
  },
  "devDependencies": {
    "k2-portal-plugin": "^{{{ version }}}",
    "@types/react": "^17.0.0",
    "@types/react-dom": "^17.0.0",
    "@umijs/test": "^3.4.25",
    "lint-staged": "^10.0.7",
    "prettier": "^2.2.0",
    "react": "17.x",
    "react-dom": "17.x",
    "typescript": "^4.1.2",
    "yorkie": "^2.0.0"
  }
}