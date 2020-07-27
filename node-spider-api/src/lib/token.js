const jwt = require('jsonwebtoken');
const secret = 'nodetoken'

exports.signToken = ({username, id, moment} = {}) => {
  return jwt.sign({
    username,
    id,
    moment
  }, secret, {
    expiresIn: 10
  });
}

exports.verifyToken = (token) => {
  return jwt.verify(token, secret)
}

exports.decodedToken = (token) => {
  return jwt.decode(token, serect)
}