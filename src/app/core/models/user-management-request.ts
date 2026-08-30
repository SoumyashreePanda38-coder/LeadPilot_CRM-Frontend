export interface UserManagementRequest {

  employeeId: string;

  fullName: string;

  username: string;

  email: string;

  phoneNumber: string;

  password: string;

  designation?: string;

  department?: string;
}