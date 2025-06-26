import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a standard UUID v4
 * @returns A UUID v4 string
 */
export const generateUUID = (): string => {
  return uuidv4();
};

/**
 * Generates a prefixed ID using UUID v4
 * @param prefix The prefix to add before the UUID
 * @returns A string in the format `${prefix}_${uuid}`
 */
export const generatePrefixedId = (prefix: string): string => {
  return `${prefix}_${uuidv4()}`;
};

/**
 * Checks if a string is a valid UUID v4
 * @param id The string to check
 * @returns Boolean indicating if the string is a valid UUID
 */
export const isValidUUID = (id: string): boolean => {
  if (!id) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

/**
 * Ensures the input is a valid UUID, generating a new one if necessary
 * @param id The potential UUID to validate
 * @returns A valid UUID (either the input if valid, or a new one)
 */
export const ensureUUID = (id?: string): string => {
  if (id && isValidUUID(id)) return id;
  return generateUUID();
};

/**
 * Extracts the raw UUID part from a prefixed ID
 * @param prefixedId A prefixed ID in the format `prefix_uuid`
 * @returns The UUID part if found, or null if not in the expected format
 */
export const extractUUIDFromPrefixedId = (prefixedId: string): string | null => {
  if (!prefixedId || !prefixedId.includes('_')) return null;
  
  const parts = prefixedId.split('_');
  const potentialUUID = parts[parts.length - 1];
  
  return isValidUUID(potentialUUID) ? potentialUUID : null;
};
