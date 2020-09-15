const mongoose = require('mongoose')
const fs = require('fs')

const Results = require('./models/results')

const {processImage} = require('./functions/main')
const {wait} = require('./core/utils')

const config = require('./config')

void (async () => {
  await mongoose.connect(config.mongodb, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })

  console.log('connected')

  while (true) {
    if (fs.existsSync('stop.txt')) {
      console.log('exiting')
      break
    }
    const result = await Results.findOneAndUpdate({status: 0}, {$set: {status: 1}}, {new: true})

    if (!result) {
      await wait(1000)
      continue
    }

    await processImage(result.user_id, result.file_id)
      .then(() => Results.updateOne({_id: result._id}, {$set: {status: 2}}))
      .catch((error) => {
        console.error(error)
        return Results.updateOne({_id: result._id}, {$set: {status: 3, error}})
      })

  }
})()

