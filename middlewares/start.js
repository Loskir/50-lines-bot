const {Composer} = require('telegraf')
const {createCanvas, loadImage} = require('canvas')

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

const decel = (x) => 1 - (x - 1) * (x - 1) // easing

composer.on('photo', async (ctx) => {
  const start = Date.now()

  const url = await ctx.telegram.getFileLink(ctx.message.photo[ctx.message.photo.length - 1].file_id)

  const img = await loadImage(url)

  const HEIGHT = 750

  const imageWidth = Math.floor(img.width * HEIGHT / img.height)
  const imageHeight = HEIGHT

  const sourceCanvas = createCanvas(imageWidth, imageHeight)
  const resultCanvas = createCanvas(imageWidth, imageHeight)
  const sourceCtx = sourceCanvas.getContext('2d')
  const resultCtx = resultCanvas.getContext('2d')

  sourceCtx.drawImage(img, 0, 0, imageWidth, imageHeight)

  const imgd = sourceCtx.getImageData(0, 0, imageWidth, imageHeight)
  const pix = imgd.data
  const n = pix.length

  for (let i = 0; i < n; i += 4) {
    const grayscale = pix[i + 3] === 0 ? 255 : pix[i] * .3 + pix[i + 1] * .59 + pix[i + 2] * .11
    pix[i] = grayscale
    pix[i + 1] = grayscale
    pix[i + 2] = grayscale
    pix[i + 3] = 255
  }

  for (let y = 0; y < 50; ++y) {
    resultCtx.beginPath()
    resultCtx.lineWidth = 2
    resultCtx.lineJoin = 'round'

    let l = 0

    for (let x = 0; x < imageWidth; ++x) {
      const c = pix[((y * imageHeight / 50 + 6) * imageWidth + x) * 4]

      l += (255 - c) / 255

      const m = (255 - c) / 255

      resultCtx.lineTo(
        x,
        (y + 0.5) * imageHeight / 50 + Math.sin(l * Math.PI / 2) * 5 * decel(m)
      )
    }
    resultCtx.stroke()
  }

  const resultBuffer = resultCanvas.toBuffer()

  console.log(`done in ${Date.now() - start}ms`)

  await ctx.replyWithPhoto({source: resultBuffer})
})

module.exports = composer
