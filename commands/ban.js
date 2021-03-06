module.exports = {
    // i know i've basically copy-pasted kick dont kill me
    name: 'ban',
    description: 'Bans someone.',
    perms: ['banMembers'],
    botPerms: ['banMembers'],
    dmable: false,
    code: async (ctx, args) => {
        let id = args.shift()
        if (id === undefined) {
            return await ctx.send(':x: | Provide a user mention or ID.')
        }
        let user = ctx.bot.parseUser(id, ctx.guild)
        let reason = args.join(' ')
        let u;
        if (user === undefined) {
            u = `\`${id}\``
            // return await ctx.send(':x: | Invalid user.')
        } else {
            u = `${user.username}#${user.discriminator}`
        }
        if (reason === '') {
            reason = `[ Ban by ${ctx.author.username}#${ctx.author.discriminator} ]`
        } else {
            reason = `${ctx.author.username}#${ctx.author.discriminator}: ${reason}`
        }
        try {
            if (user !== undefined) {
                await user.ban(7, reason);
            } else {
                await ctx.guild.banMember(id, 7, reason)
            }
            await ctx.send(`:hammer: Banned ${u}.`)
        } catch(e) {
            await ctx.send(':x: | Unable to ban user. Check your role order.')
        }
    }
}