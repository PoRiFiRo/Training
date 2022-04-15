// Require all the validated permissions
const { Perms } = require("../Validation/Permissions")
const { Client } = require("discord.js")

/**
 * @param { Client } client
 */

module.exports = async (client, PG, Ascii) => {

    // Same as events, heading first for the table
    const Table = new Ascii("Commands Loaded")

    // Making all the commands as an empty array
    CommandsArray = [];

    // Map all the command files
    (await PG(`${process.cwd()}/Commands/*/*.js`)).map(async (file) => {

        // The command should be inside a folder as a file
        const command = require(file)

        // If the command has no name
        if (!command.name)
            return Table.addRow(file.split("/")[7], "🔸 FAILED", "Missing a name")

        // Here's a catch, context menu commands can't have descriptions. So, if we remove the description from them, it will consider the command as a failure. That's why we are giving it an option to choose from
        if (!command.context && !command.description)
            return Table.addRow(command.name, "🔸 FAILED", "Missing a description")

        // That's the permission part for Slash Commands
        if (command.permission) {

            // The default premission should be for everyone
            if (Perms.includes(command.permission))
                command.defaultPermission = false
            else
                return Table.addRow(command.name, "🔸 FAILED", "Permission is invalid")

        }

        // It will start to add all the commands for the guild
        client.commands.set(command.name, command)
        CommandsArray.push(command)

        await Table.addRow(command.name, "🔹 SUCCESSFUL")

    })

    console.log(Table.toString())

    // PERMISSIONS CHECK //

    client.on("ready", async () => {

        // Use your own or private guild id for test purpose
        const MainGuild = await client.guilds.cache.get("930742714381766686")

        // Setting all the commands for the guild
        MainGuild.commands.set(CommandsArray).then(async (command) => {

            const Roles = (commandName) => {

                // Now, we're gonna find the given permission through all over the roles in discord
                const cmdPerms = CommandsArray.find((c) => c.name === commandName).permission

                if (!cmdPerms) return null

                // Filtering all the permissions for that particular command
                return MainGuild.roles.cache.filter((r) => r.permissions.has(cmdPerms))

            }

            const fullPermissions = command.reduce((accumulator, r) => {

                // It will search for whether the that role has all the permissions given or not
                const roles = Roles(r.name)
                if (!roles) return accumulator

                const permissions = roles.reduce((a, r) => {

                    return [...a, { id: r.id, type: "ROLE", permission: true }]

                }, [])

                return [...accumulator, { id: r.id, permissions }]

            }, [])

            // Finally setting all the permissions for the guild
            await MainGuild.commands.permissions.set({ fullPermissions })

        })

    })

}