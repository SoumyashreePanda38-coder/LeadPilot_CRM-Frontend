import { Role } from './role';

/**
 * ==========================================
 * Model : LoginResponse
 *
 * Description:
 * Response returned after successful login.
 * ==========================================
 */

export interface LoginResponse {

  id: number;

  employeeId: string;

  fullName: string;

  username: string;

  email: string;

  role: Role;

  designation: string;

  profileImage: string | null;

  message: string;

  token: string;

}