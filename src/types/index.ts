export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  mobile: string;
  address?: string;
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}