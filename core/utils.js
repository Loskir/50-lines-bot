module.exports = {
  getUserString(from) {
    return `${from.first_name}${from.last_name ? ` ${from.last_name}` : ''}${from.username ? ` @${from.username}` : ''}`
  },
}
