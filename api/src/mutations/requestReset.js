// adapted straight up from https://github.com/wesbos/advanced-react-rerecord/blob/master/backend/mutations/requestReset.js
// this is the way keystone recommends in their docs

import { promisify } from 'util'
import { randomBytes } from 'crypto'
import { mailTemplate, sgMail } from '../mail/mail'

export async function requestReset (parent, args, ctx, info, { query }) {
  // 1. Check if this is a real user
  const response = await query(
    `query {
      allUsers(where: { email: "${args.email}" }) {
        email
        id
      }
    }`
    , { skipAccessControl: true })

  const [user] = response.data.allUsers
  if (!user) {
    throw new Error(`No such user found for email ${args.email}`)
  }
  // 2. Set a reset token and expiry on that user
  const resetToken = (await promisify(randomBytes)(20)).toString('hex')
  const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now
  const updateResponse = await query(`mutation {
    updateUser(
      id: "${user.id}",
      data: { resetToken: "${resetToken}", resetTokenExpiry: "${resetTokenExpiry}" },
    ) {
      email
      resetToken
      resetTokenExpiry
    }
  }`, { skipAccessControl: true })

  // 3. Email them that reset token
  const mailRes = await sgMail.send({
    from: 'adamkarlsten@gmail.com',
    to: `${user.email}`,
    subject: 'Your Password Reset Token',
    html: mailTemplate(`Your Password Reset Token is here!
      \n\n
      <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset</a>`)
  })

  // 4. Return the message
  return { message: 'Check your email son!' }
}
