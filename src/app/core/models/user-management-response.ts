import { Role } from './role';
import { UserStatus } from './user-status';

export interface UserManagementResponse {

  id: number;

  employeeId: string;

  fullName: string;

  username: string;

  email: string;

  phoneNumber: string;

  role: Role;

  designation: string;

  status: UserStatus;

  profileImage: string | null;

  createdAt: string;

  updatedAt: string;

  department: string;

  lastLogin: string | null;
}

