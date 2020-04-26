const Telegraf = require('telegraf')

const mongoose = require('mongoose')

const log = require('./core/logs')

const config = require('./config')

void (async () => {
  await mongoose.connect(config.mongodb, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  const bot = new Telegraf(config.bot_token)

  bot.use(require('./passThruMiddlewares/user'))

  bot.use(require('./middlewares/start'))

  bot.catch((error) => {
    log.error('Error: ', error)
    console.error(error.stack)
  })

  const me = await bot.telegram.getMe()
  bot.options.username = me.username

  bot.startPolling()

  log.info(`@${me.username} is running`)
})()
