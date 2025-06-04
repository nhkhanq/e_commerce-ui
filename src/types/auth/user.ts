export interface Permission {
  name: string;
}

export interface Role {
  name: string;
  permissions: Permission[];
}

export interface UserRes {
  code: number;
  message: string;
  result: {
    firstName: string;
    lastName: string;
    email: string;
    roles: Role[];
  };
} 
