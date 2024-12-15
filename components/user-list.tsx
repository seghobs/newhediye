'use client';

import { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Gift, Trash2, UserMinus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

interface UserListProps {
  users: User[];
  onGiveGift: (userId: string) => void;
  onRemoveGift: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export function UserList({ users, onGiveGift, onRemoveGift, onDeleteUser }: UserListProps) {
  return (
    <div className="space-y-4">
      {users.map(user => (
        <div
          key={user.id}
          className="flex items-center justify-between p-4 bg-card rounded-lg shadow"
        >
          <div>
            <h3 className="font-medium">{user.name}</h3>
            {user.lastGiftDate && (
              <p className="text-sm text-muted-foreground">
                Son hediye: {format(parseISO(user.lastGiftDate), 'PPP', { locale: tr })}
              </p>
            )}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onGiveGift(user.id)}
              title="Hediye Ver"
            >
              <Gift className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onRemoveGift(user.id)}
              title="Hediyeyi Kaldır"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDeleteUser(user.id)}
              title="Kullanıcıyı Sil"
            >
              <UserMinus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}