const { devices } = require('@playwright/test');

module.exports = {
    testDir: "./src/tests/e2e",

    testMatch: "*.spec.js",
    fullyParallel: false,
    workers: 1,

    use: {
        baseURL: "http://localhost:3030",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
        trace: "retain-on-failure"
    },

    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    ],

    reporter: [
        ["html", {
            outputFolder: "./reports/playwright",
            open: "never"
        }]
    ],

    outputDir: "./test-results/playwright",
};