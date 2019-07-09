//
// see https://basarat.gitbooks.io/typescript/docs/testing/jest.html

module.exports = {
    roots: [
        "<rootDir>/src"
    ],

    testEnvironment: 'node',

    testPathIgnorePatterns: [
        "/node_modules/",
    ],

    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },

    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",

    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],

    setupFiles: ["jest-canvas-mock"]
};