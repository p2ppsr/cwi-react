/**
 * Groups and sorts permissions by their target domains. Each domain will have a unique list of counterparties,
 * along with the original permission grant associated with each counterparty. This is useful for managing
 * permissions in a structured format where permissions are categorized by domains and counterparties are
 * uniquely identified within these categories.
 *
 * @param {Array} permissions - An array of permission objects to be sorted
 *
 * @returns {Array} An array of objects, each representing a domain with its unique counterparties
 */
const sortPermissions = (permissions) => {
  const groupedPermissions = permissions.reduce((acc, curr) => {
    // Check if the domain already exists in the accumulator
    if (!acc[curr.domain]) {
      // If not, initialize it with the current counterparty and permission grant
      acc[curr.domain] = [{ counterparty: curr.counterparty, permissionGrant: curr }]
    } else {
      // If it exists, add the counterparty and permission grant if it's not already there
      const existingEntry = acc[curr.domain].find(entry => entry.counterparty === curr.counterparty)
      if (!existingEntry) {
        acc[curr.domain].push({ counterparty: curr.counterparty, permissionGrant: curr })
      }
    }
    return acc
  }, {})

  // Convert the grouped permissions object to the desired array format
  return Object.entries(groupedPermissions).map(([originator, permissions]) => ({
    originator,
    permissions
  }))
}
export default sortPermissions
