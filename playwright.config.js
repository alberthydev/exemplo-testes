module.exports = {
    testDir: "./src/tests/e2e",

    testMatch: "*.spec.js",

    use: {
        baseURL: "http://localhost:3030",

        screenshot: "only-on-failure",
        video: "retain-on-failure",
        trace: "retain-on-failure"
    },

    reporter: [
        ["html", {
            outputFolder: "./reports/playwright",
            open: "never"
        }]
    ],

    outputDir: "./test-results/playwright",

    webServer: {
        command: "npm start",
        url: "http://localhost:3030",
        reuseExistingServer: true
    }
};