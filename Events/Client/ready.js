const { Client } = require("discord.js")
const mongoose = require("mongoose")
const mongoDBPR = process.env.MONGOURLPR
const mongoDBSC = process.env.MONGOURLSC

module.exports = {
    // ready should be a once event
    name: "ready",
    once: true,

    /**
    * @param {Client} client
    */

    execute(client) {

        console.log(`${client.user.tag} is now online!`)

        // Set your activity if you want
        client.user.setActivity("BTM(BedTime) Official Bot", { type: "WATCHING" })

        // Connecting to MONGODB
        if (!mongoDBPR) return

        mongoose.connect(mongoDBPR, {

            useNewUrlParser: true,
            useUnifiedTopology: true

        }).then(() => {

            console.log("Connected to BTM(BedTime) Primary Database!")

        }).catch(err => {

            console.log(err)

        })

    }

}