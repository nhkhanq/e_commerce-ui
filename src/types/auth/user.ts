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
    id: string; // ✅ Add userId field
    firstName: string;
    lastName: string;
    email: string;
    active: boolean;
    roles: Role[];
  };
} 
