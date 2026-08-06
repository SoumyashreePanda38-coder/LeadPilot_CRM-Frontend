import { Role } from './role';
import { UserStatus } from './user-status';

/**
 * ==========================================
 * Model : UserProfileResponse
 *
 * Description:
 * Profile information of the
 * logged-in user.
 * ==========================================
 */

export interface UserProfileResponse {

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

}