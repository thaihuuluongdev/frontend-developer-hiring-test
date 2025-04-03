import axios from 'axios';
import { TUser } from '../types/user';

export const fetchUsers = async (): Promise<TUser[]> => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users`, {});
    
    return response.data.map((user: any) => ({
      id: user.id.toString(),
      name: user.name,
      balance: user.balance || 0,
      email: user.email,
      registerAt: new Date(user.registerAt),
      active: user.isActive
    }));
    
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw new Error('Failed to fetch users');
  }
};
