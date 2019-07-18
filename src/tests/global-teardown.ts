/**
 * Ran after all tests
 */

module.exports = async () => {
    global["__SERVER__"].close();
    console.log("Server closing...");
}