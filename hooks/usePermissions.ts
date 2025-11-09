
import { useContext, useCallback } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Resource, Action, Role } from '../types';

/**
 * Checks if a user's roles grant a specific permission.
 * @param userRoles - An array of the user's role objects.
 * @param resource - The resource being accessed.
 * @param action - The action being performed.
 * @returns `true` if permission is granted, `false` otherwise.
 */
function checkPermission(userRoles: Role[], resource: Resource, action: Action): boolean {
  if (!userRoles) {
    return false;
  }
  // Check if any of the user's roles have the required permission.
  return userRoles.some(role => {
    const resourcePermissions = role.permissions[resource];
    return resourcePermissions?.includes(action) ?? false;
  });
}

export const usePermissions = () => {
  const { user } = useContext(AuthContext);

  const can = useCallback((resource: Resource, action: Action): boolean => {
    if (!user) {
      return false;
    }
    return checkPermission(user.roles, resource, action);
  }, [user]);

  return { can, user };
};
