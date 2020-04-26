const fs = require('fs')
const yaml = require('js-yaml')

module.exports = yaml.safeLoad(fs.readFileSync(`${__dirname}/config.yaml`))
