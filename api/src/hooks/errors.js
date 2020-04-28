import { createError } from 'apollo-errors'

export const AccessDeniedError = createError('AccessDeniedError', {
  message: 'You do not have access to this resource',
  options: { showPath: true }
})

export const ThreadClosedError = createError('ThreadClosedError', {
  message: 'This thread has been locked and cannot be posted to.',
  options: { showPath: true }
})

export const ForumBannedError = createError('ForumBannedError', {
  message: 'This forum has been banned and cannot be posted to.',
  options: { showPath: true }
})
