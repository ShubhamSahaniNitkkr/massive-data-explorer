export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export type UserRole = 'admin' | 'manager' | 'analyst' | 'viewer' | 'developer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  createdAt: string;
  lastLoginAt: string;
  country: string;
}
