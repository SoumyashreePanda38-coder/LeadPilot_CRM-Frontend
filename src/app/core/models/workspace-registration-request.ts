export interface WorkspaceRegistrationRequest {
  organizationName: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  designation?: string;
  password: string;
  confirmPassword: string;
}