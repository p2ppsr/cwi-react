/**
 * Sorts and groups an array of permissions by domain and counterparty.
 *
 * This function takes an array of permission objects and organizes them into a nested structure
 * based on the domain and counterparty values. It groups permissions by domain and then by
 * counterparty within each domain, ensuring that each counterparty is listed only once per domain.
 *
 * This allows permissions to be revoked on a per-counterparty basis.
 *
 * @param {Array} permissions - An array of permission objects to be sorted and grouped.
 *
 * @returns {Array} An array of objects, each representing a domain with its unique permissions
 */
const sortPermissionsForProtocols = (permissions) => {
  const groupedPermissions = permissions.reduce((acc, curr) => {
    // Check if the domain already exists in the accumulator
    const protocolIdentifier = `${curr.protocol} ${curr.securityLevel}`
    if (!acc[protocolIdentifier]) {
      // If not, initialize it with the current counterparty and permission grant
      acc[protocolIdentifier] = [{ counterparty: curr.counterparty, permissionGrant: curr }]
    } else {
      // If it exists, add the counterparty and permission grant if it's not already there
      const existingEntry = acc[protocolIdentifier].find(entry => entry.counterparty === curr.counterparty)
      if (!existingEntry) {
        acc[protocolIdentifier].push({ counterparty: curr.counterparty, permissionGrant: curr })
      }
    }
    return acc
  }, {})

  // Convert the grouped permissions object to the desired array format
  return Object.entries(groupedPermissions).map(([protocol, permissions]) => ({
    protocol,
    permissions
  }))
}
export default sortPermissionsForProtocols
