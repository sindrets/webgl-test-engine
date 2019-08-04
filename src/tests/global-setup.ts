/**
 * Ran before any tests
 */

module.exports = async () => {
    const httpServer = require("http-server");

    // Load environment variables.
    require("dotenv").config();

    const PORT = process.env["PORT"] || 9876;
    const HOST = process.env["HOST"] || "localhost";
    const url = `http://${HOST}:${PORT}`;
    process.env["TEST_URL"] = url;
    
    let server = httpServer.createServer();
    global["__SERVER__"] = server;
    server.listen(PORT, HOST);
    console.log("\nServer listening on:", url);
}
