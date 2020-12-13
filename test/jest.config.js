/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');
const root = resolve(__dirname, '..');
const rootConfig = require(`${root}/jest.config.js`);

module.exports = {
    ...rootConfig, ...{
        rootDir: root,
        displayName: 'root-tests',
        setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts'],
        testMatch: ['<rootDir>/src/**/*.test.ts']
    }
}