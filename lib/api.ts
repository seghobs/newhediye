import { User } from '@/types/user';

const API_BASE_URL = 'http://localhost:3001/api';

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

export async function addUsers(users: Omit<User, 'lastGiftDate'>[]): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(users),
  });
  if (!response.ok) throw new Error('Failed to add users');
  return response.json();
}

export async function giveGift(userId: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/gift`, {
    method: 'POST',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  return response.json();
}

export async function removeGift(userId: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/gift`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to remove gift');
  return response.json();
}

export async function deleteUser(userId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete user');
}