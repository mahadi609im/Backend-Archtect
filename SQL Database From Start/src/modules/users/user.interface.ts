export interface IUser {
  name: string;
  email: string;
  age?: number | null;
  password: string;
  role: string;
}

// All fields optional, email removed, is_active added
export type IUpdateUser = Partial<Omit<IUser, 'email'>> & {
  is_active?: boolean;
};
