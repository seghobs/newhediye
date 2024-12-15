'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/user';
import { UserInput } from '@/components/user-input';
import { FilterButtons } from '@/components/filter-buttons';
import { UserList } from '@/components/user-list';
import * as api from '@/lib/api';

export default function GiftManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [userInput, setUserInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'eligible' | 'recent'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.fetchUsers();
      setUsers(data);
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Kullanıcılar yüklenirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  };

  const addUsers = async () => {
    try {
      const newUsers = userInput
        .split('\n')
        .filter(line => line.trim())
        .map(line => ({
          id: Math.random().toString(36).substr(2, 9),
          name: line.trim(),
        }));

      await api.addUsers(newUsers);
      setUserInput('');
      fetchUsers();
      toast({
        title: 'Başarılı',
        description: 'Kullanıcılar başarıyla eklendi',
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Kullanıcılar eklenirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  };

  const handleGiveGift = async (userId: string) => {
    try {
      await api.giveGift(userId);
      fetchUsers();
      toast({
        title: 'Başarılı',
        description: 'Hediye başarıyla verildi',
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: error instanceof Error ? error.message : 'Hediye verilirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveGift = async (userId: string) => {
    try {
      await api.removeGift(userId);
      fetchUsers();
      toast({
        title: 'Başarılı',
        description: 'Hediye başarıyla kaldırıldı',
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Hediye kaldırılırken bir hata oluştu',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.deleteUser(userId);
      fetchUsers();
      toast({
        title: 'Başarılı',
        description: 'Kullanıcı başarıyla silindi',
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Kullanıcı silinirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  };

  const copyTodaysGifts = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysGifts = users
      .filter(user => user.lastGiftDate?.startsWith(today))
      .map(user => `@${user.name}`)
      .join('\n');

    if (todaysGifts) {
      navigator.clipboard.writeText(todaysGifts);
      toast({
        title: 'Başarılı',
        description: 'Bugünkü hediye alanlar panoya kopyalandı',
      });
    } else {
      toast({
        title: 'Bilgi',
        description: 'Bugün hediye alan kimse yok',
      });
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'eligible') {
      return !user.lastGiftDate || new Date(user.lastGiftDate) <= new Date(Date.now() - 20 * 24 * 60 * 60 * 1000);
    }
    if (filter === 'recent') {
      return user.lastGiftDate && new Date(user.lastGiftDate) > new Date(Date.now() - 20 * 24 * 60 * 60 * 1000);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <UserInput
        value={userInput}
        onChange={setUserInput}
        onSubmit={addUsers}
      />
      <FilterButtons
        currentFilter={filter}
        onFilterChange={setFilter}
        onCopyToday={copyTodaysGifts}
      />
      <UserList
        users={filteredUsers}
        onGiveGift={handleGiveGift}
        onRemoveGift={handleRemoveGift}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
}