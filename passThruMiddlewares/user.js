const Utils = require('../core/utils')
const log = require('../core/logs')

const Users = require('../models/users')

module.exports = async (ctx, next) => {
  if (!(ctx.chat && ctx.chat.type === 'private')) {
    return next()
  }

  let user
  try {
    user = await Users.findOne({user_id: ctx.from.id})
    let params = {
      user_id: ctx.from.id,
      first_name: ctx.from.first_name,
      last_name: ctx.from.last_name,
      username: ctx.from.username,
      language_code: ctx.from.language_code,
    }

    if (!user) {
      // ctx.mixpanel.track('New user')
      log.info('new user')

      await ctx.telegram.sendMessage(89307233, `New user: ${Utils.getUserString(ctx.from)}`)
        .catch(console.error)

      ctx.state.is_new_user = true

      user = await Users.create(params)
    } else {
      Object.assign(user, params, {
        is_disabled: false,
        last_activity_at: new Date(),
      })
      user = await user.save()
    }
  } catch (error) {
    log.error('Error user', error)
  }
  ctx.user = user || {}
  return next()
}
