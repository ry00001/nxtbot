const util = require('util')
const superagent = require('superagent')

module.exports = {
    name: 'eval',
    description: 'Runs JavaScript code. Owner-only, for obvious reasons.',
    dmable: true,
    code: async (ctx, args) => {
        let code = `(async function() {\n${args.join(' ')}\n})()`
        try {
            let result = eval(code)
            if (result && typeof result.then === 'function') result = await result
            if (typeof result !== 'string' && !(/\/\/ ?no(?:-| )?auto(?:-| )?inspect/.test(code))) {
                result = util.inspect(result)
            }
            let len
            try {
                len = result.length || toString(result).length
            } catch(e) {
                await ctx.send('```No output.```')
            }
            if (len > 2000) {
                superagent.post('https://hastebin.com/documents')
                    .type('text/plain')
                    .send(result)
                    .then(a => {
                        ctx.send(`https://hastebin.com/${a.body.key}`)
                    })
            } else {
                await ctx.send(`\`\`\`\n${result}\`\`\``)
            }
        } catch(e) {
            let te = e;
            if (/\/\/ ?stack/.test(code)) te = e.stack
            await ctx.send(`\`\`\`\n${te}\`\`\``)
        }
    },
    ownerOnly: true,
    aliases: ['ev', 'e']
}