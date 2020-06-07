export const devEndpoint = 'http://192.168.10.117:3000/'
export const testEndpoint = 'https://fora-test-api.adamkarlsten.com/'
export const prodEndpoint = 'https://api.fora.fun/'

export const postsPerPage = process.env.ENDPOINT === 'test' ? 3 : process.env.NODE_ENV === 'production' ? 20 : 3
export const threadsPerPage = process.env.ENDPOINT === 'test' ? 3 : process.env.NODE_ENV === 'production' ? 20 : 3
export const forumsPerPage = 3
