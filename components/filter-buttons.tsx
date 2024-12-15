'use client';

import { Button } from '@/components/ui/button';

interface FilterButtonsProps {
  currentFilter: 'all' | 'eligible' | 'recent';
  onFilterChange: (filter: 'all' | 'eligible' | 'recent') => void;
  onCopyToday: () => void;
}

export function FilterButtons({ currentFilter, onFilterChange, onCopyToday }: FilterButtonsProps) {
  return (
    <div className="space-x-4">
      <Button
        variant={currentFilter === 'all' ? 'default' : 'outline'}
        onClick={() => onFilterChange('all')}
      >
        Tüm Kullanıcılar
      </Button>
      <Button
        variant={currentFilter === 'eligible' ? 'default' : 'outline'}
        onClick={() => onFilterChange('eligible')}
      >
        Hediye Alabilecekler
      </Button>
      <Button
        variant={currentFilter === 'recent' ? 'default' : 'outline'}
        onClick={() => onFilterChange('recent')}
      >
        Son Hediye Alanlar
      </Button>
      <Button onClick={onCopyToday}>
        Bugünkü Hediye Alanları Kopyala
      </Button>
    </div>
  );
}