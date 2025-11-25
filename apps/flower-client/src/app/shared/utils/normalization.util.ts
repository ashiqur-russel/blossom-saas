/**
 * Data normalization utilities
 * Centralizes data transformation logic
 */

/**
 * Extracts ID from various MongoDB/API response formats
 * Handles both MongoDB _id and standard id fields
 * @param entity - Entity object with id or _id
 * @returns String ID
 */
export function extractId(entity: any): string {
  if (!entity) {
    return '';
  }

  if (entity.id) {
    return typeof entity.id === 'string' ? entity.id : entity.id.toString();
  }

  if (entity._id) {
    if (typeof entity._id === 'string') {
      return entity._id;
    }
    if (entity._id.$oid) {
      return entity._id.$oid;
    }
    return entity._id.toString();
  }

  return '';
}

/**
 * Normalizes a date field from various formats to Date object
 * @param dateValue - Date in various formats
 * @returns Date object or current date if invalid
 */
export function normalizeDateField(dateValue: any): Date {
  if (!dateValue) {
    return new Date();
  }
  if (dateValue instanceof Date) {
    return dateValue;
  }
  return new Date(dateValue);
}

/**
 * Safely converts a value to a number
 * @param value - Value to convert
 * @param defaultValue - Default value if conversion fails
 * @returns Number value
 */
export function toNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}



