require('dotenv').config()

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI
console.log("the port is", PORT)
module.exports = {PORT, MONGO_URI}