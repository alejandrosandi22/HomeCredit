export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  name: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
}

export interface UpdateUserData extends Partial<CreateUserData> {
  id: string;
}

export interface UserFormData {
  email: string;
  name: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
}

export interface UsersResponse {
  success: boolean;
  data?: User[];
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserResponse {
  success: boolean;
  data?: User;
  message?: string;
}

export interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  selectedUser: User | null;
  isModalOpen: boolean;
  modalMode: 'create' | 'edit' | 'view';
}

export interface UsersFilters {
  search: string;
  role: string;
  status: string;
  page: number;
  limit: number;
}
