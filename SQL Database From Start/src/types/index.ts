export type Role = 'admin' | 'agent' | 'user';

export const USER_ROLE = {
  admin: 'admin',
  agent: 'agent',
  user: 'user',
} as const;
