import { TUser } from '../types/user';

const firstNames = ['Andrew', 'Alvaro', 'Pedro', 'John', 'Sarah', 'William', 'Emma', 'Ryan', 'Michael', 'Jennifer'];
const lastNames = ['Taylor', 'Garcia', 'Moreno', 'Robinson', 'White', 'King', 'Gonzalez', 'Young', 'Taylor', 'King'];
const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'mail.com'];
const statuses = [true, false];

const generateRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const generateMockUsers = (count: number): TUser[] => {
  const startDate = new Date(2020, 0, 1);
  const endDate = new Date();

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const active = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      id: `user-${i + 1}`,
      name: `${firstName} ${lastName}`,
      balance: Math.floor(Math.random() * 10000) + 1000,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
      registerAt: generateRandomDate(startDate, endDate),
      active
    };
  });
};