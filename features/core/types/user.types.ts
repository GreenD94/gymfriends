import { RoleId, RoleName } from '../constants/roles.constants';

export type UserRole = RoleName;

export interface UserDocument {
  _id: string;
  email: string;
  password: string;
  name: string;
  roleId: RoleId;
  phone: string;
  instagram: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserPayload {
  email: string;
  password?: string;
  name: string;
  role: RoleName;
  phone?: string;
  instagram?: string;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  instagram?: string;
  role?: RoleName;
}

export interface UserDb {
  _id?: string;
  email: string;
  password?: string;
  name: string;
  roleId: RoleId;
  role?: RoleName;
  phone?: string;
  instagram?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface User extends Omit<UserDb, 'role'> {
  role: RoleName;
}

export interface CreateUserInput {
  email: string;
  password?: string;
  name: string;
  role: RoleName;
  phone?: string;
  instagram?: string;
}

export interface UpdateUserInput {
  name?: string;
  phone?: string;
  instagram?: string;
  role?: RoleName;
}

