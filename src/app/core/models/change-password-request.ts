/**
 * ==========================================
 * Model : ChangePasswordRequest
 *
 * Description:
 * Used to change the password of
 * the logged-in user.
 * ==========================================
 */

export interface ChangePasswordRequest {

  currentPassword: string;

  newPassword: string;

  confirmPassword: string;

}