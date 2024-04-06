/**
 * Returns the default role from the given array of roles.
 * The default role is the role with type 'global'.
 * If no default role is found, null is returned.
 *
 * @param {Array} roles - The array of roles to search from.
 * @returns {string | null} - The default role or null if not found.
 */
export default function getDefaultRole (roles) {
  // console.log({ roles })
  const defaultRole = roles.find((role) => role.type === 'global');
  return defaultRole?.title || null;
}
