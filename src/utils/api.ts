import { TUser } from '../types/user';
import { generateMockUsers } from './mockData';

export const fetchUsers = async (): Promise<TUser[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return generateMockUsers(106); 
};