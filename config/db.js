const mongoose = require("mongoose")
require("dotenv").config()

const connection = mongoose.connect(process.env.MONGDODB_URL)

module.exports = {connection}