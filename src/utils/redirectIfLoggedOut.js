import { waitForInitialization, isAuthenticated } from 'pages/Settings/About/node_modules/@cwi/core'

export default async (h, r) => {
  await waitForInitialization()
  if (!isAuthenticated()) {
    h.push(r.Greeter)
  }
}
