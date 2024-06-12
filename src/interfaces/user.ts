export interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  address: string;
  postalcode: string;
  phone1: string;
  isActive: boolean;
  password?: string;
}

export interface UserResponse {
  list: User[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}
