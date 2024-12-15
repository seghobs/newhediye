import GiftManagement from '@/components/gift-management';

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Hediye Yönetim Sistemi</h1>
      <GiftManagement />
    </div>
  );
}