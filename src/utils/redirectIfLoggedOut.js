import { waitForInitialization, isAuthenticated } from '@cwi/core'

export default async (h, r) => {
  await waitForInitialization()
  if (!isAuthenticated()) {
    h.push(r.Greeter)
  }
}
