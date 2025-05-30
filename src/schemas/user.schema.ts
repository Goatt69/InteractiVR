import { z } from 'zod';

/**
 * User form validation schema using Zod
 * Mirrors backend validation rules to ensure consistent validation
 */

// Error messages
export const errors = {
  email: {
    invalid: 'Invalid email format',
  },
  name: {
    required: 'Name is required',
    tooShort: 'Name must be at least 3 characters',
  },
  password: {
    required: 'Password is required',
    tooShort: 'Password must be at least 8 characters',
    missingUppercase: 'Password must contain at least one uppercase letter',
    missingLowercase: 'Password must contain at least one lowercase letter',
    missingNumber: 'Password must contain at least one number',
  }
};

// Login schema
export const loginSchema = z.object({
  email: z.string()
    .min(1, { message: errors.email.invalid })
    .email({ message: errors.email.invalid }),
  password: z.string()
    .min(6, { message: errors.password.required })
});

// Registration schema
export const registerSchema = z.object({
  name: z.string()
    .min(3, { message: errors.name.required })
    .min(2, { message: errors.name.tooShort }),
  email: z.string()
    .min(1, { message: errors.email.invalid })
    .email({ message: errors.email.invalid }),
  password: z.string()
    .min(1, { message: errors.password.required })
    .min(8, { message: errors.password.tooShort })
    .regex(/[A-Z]/, { message: errors.password.missingUppercase })
    .regex(/[a-z]/, { message: errors.password.missingLowercase })
    .regex(/[0-9]/, { message: errors.password.missingNumber })
});

// Profile update schema (partial, doesn't require all fields)
export const updateProfileSchema = registerSchema.partial().extend({
  currentPassword: z.string().optional(),
  newPassword: z.string()
    .min(8, { message: errors.password.tooShort })
    .regex(/[A-Z]/, { message: errors.password.missingUppercase })
    .regex(/[a-z]/, { message: errors.password.missingLowercase })
    .regex(/[0-9]/, { message: errors.password.missingNumber })
    .optional(),
  confirmPassword: z.string().optional()
}).refine(data => {
  // If newPassword is provided, confirmPassword must match
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Typescript types
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
