export default function generateId () {
  const prefix = 'dapp_'
  const randomId = Math.random().toString(36).substring(2, 11)
  return prefix + randomId
}
