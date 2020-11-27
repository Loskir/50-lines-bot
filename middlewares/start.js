const {Composer} = require('telegraf')

const Results = require('../models/results')

const log = require('../core/logs')

const composer = new Composer()
composer.start((ctx) => {
  return ctx.replyWithPhoto({source: './demo.png'}, {
    caption: `Я перерисовываю картиночки, используя всего 50 линий. 

<a href="https://gist.github.com/u-ndefine/8e4bc21be4275f87fefe7b2a68487161">Оригинальный код</a>
Переписано на JavaScript by @Loskir
<a href="https://github.com/Loskir/50-lines-bot">Исходный код бота</a>, <a href="https://loskir.github.io/50-lines">веб-версия</a>
Подписывайтесь на мой канал: @Loskirs`,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  })
})

composer.on('photo', async (ctx) => {
  const queueSize = await Results.countDocuments({status: 0})
  await Results.create({
    user_id: ctx.from.id,
    file_id: ctx.message.photo[ctx.message.photo.length - 1].file_id,
  })
  if (ctx.message.caption === '/silent') {
    return log.info(`${ctx.from.id}: new result (silent)`)
  }
  log.info(`${ctx.from.id}: new result`)
  if (queueSize > 0) {
    return ctx.reply(`Я положил твою картинку в очередь. Картинок перед тобой: ${queueSize}. Пожалуйста, подожди немного`)
  }
})

module.exports = composer
