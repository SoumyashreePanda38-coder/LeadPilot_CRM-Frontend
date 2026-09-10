export interface WorkspaceRegistrationResponse {
  organizationId: number;
  organizationName: string;
  adminId: number;
  employeeId: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  designation?: string;
  role: string;
  message: string;
}