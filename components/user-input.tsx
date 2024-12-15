'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Users } from 'lucide-react';

interface UserInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function UserInput({ value, onChange, onSubmit }: UserInputProps) {
  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Kullanıcı isimlerini her satıra bir tane gelecek şekilde girin"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px]"
      />
      <Button onClick={onSubmit} className="w-full">
        <Users className="mr-2 h-4 w-4" />
        Tüm Kullanıcıları Ekle
      </Button>
    </div>
  );
}