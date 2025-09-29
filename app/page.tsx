'use client'

import { Layout } from '@/components/shared';
import { FarmDashboard } from '@/components/dashboard';
import { BreadcrumbItem } from '@/types';

export default function HomePage() {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: '🏠 Главная', href: '/' },
    { title: 'Зоны выращивания', href: '/farm' },
    { title: 'Контейнер № 41-i2f' }
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <FarmDashboard />
    </Layout>
  );
}