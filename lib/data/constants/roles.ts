/**
 * Constant Objects (not enums): erasable-syntax safe, tree-shakeable, no runtime enum codegen.
 */
export const USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
