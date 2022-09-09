export default async history => {
  await window.CWI.waitForInitialization()
  const isAuth = await window.CWI.isAuthenticated()
  if (!isAuth) {
    history.push('/')
  }
}
