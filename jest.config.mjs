import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    dir: './'
});

const customJestConfig = {
    clearMocks: true,
    collectCoverageFrom: [
        'src/contentful/**/*.js',
        'src/utils/**/*.js'
    ],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        '/node_modules/'
    ],
    coverageProvider: 'v8',
    moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/src/$1'
    },
    setupFilesAfterEnv: ['<rootDir>/test/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
    testMatch: ['<rootDir>/test/**/*.test.js']
};

export default createJestConfig(customJestConfig);
