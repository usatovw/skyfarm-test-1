'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Thermometer, Droplets, Sun, Zap, TrendingUp } from 'lucide-react';

interface MetricData {
  label: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
}

export default function FarmDashboard() {
  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      label: 'Температура',
      value: 24.5,
      unit: '°C',
      status: 'good',
      trend: 'stable',
      icon: Thermometer
    },
    {
      label: 'Влажность',
      value: 78,
      unit: '%',
      status: 'good',
      trend: 'up',
      icon: Droplets
    },
    {
      label: 'Освещение',
      value: 92,
      unit: '%',
      status: 'warning',
      trend: 'down',
      icon: Sun
    },
    {
      label: 'Энергопотребление',
      value: 156,
      unit: 'кВт/ч',
      status: 'good',
      trend: 'stable',
      icon: Zap
    }
  ]);

  const [activeContainers, setActiveContainers] = useState(12);
  const [totalYield, setTotalYield] = useState(847);

  // Симуляция обновления данных
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * 2
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Статистика фермы */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные контейнеры</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🌱</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeContainers}</div>
            <p className="text-xs text-muted-foreground">из 15 доступных</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общий урожай</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalYield} кг</div>
            <p className="text-xs text-muted-foreground">+12% за месяц</p>
          </CardContent>
        </Card>

      </div>

      {/* Метрики окружающей среды */}
      <Card>
        <CardHeader>
          <CardTitle>Параметры окружающей среды</CardTitle>
          <CardDescription>
            Текущие показатели всех активных контейнеров
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div key={index} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`h-4 w-4 ${getStatusColor(metric.status)}`} />
                      <span className="text-sm font-medium">{metric.label}</span>
                    </div>
                    <span className="text-xs">{getTrendIcon(metric.trend)}</span>
                  </div>

                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold">{metric.value.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">{metric.unit}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Progress
                      value={(metric.value / 100) * 100}
                      className="flex-1 h-2"
                    />
                    <Badge
                      variant={metric.status === 'good' ? 'default' :
                               metric.status === 'warning' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {metric.status === 'good' ? 'OK' :
                       metric.status === 'warning' ? 'Warning' : 'Critical'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Быстрые действия */}
      <Card>
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 text-left rounded-lg border hover:bg-accent transition-colors">
              <div className="text-sm font-medium">Запустить полив</div>
              <div className="text-xs text-muted-foreground">Все контейнеры</div>
            </button>
            <button className="p-4 text-left rounded-lg border hover:bg-accent transition-colors">
              <div className="text-sm font-medium">Включить освещение</div>
              <div className="text-xs text-muted-foreground">Дневной режим</div>
            </button>
            <button className="p-4 text-left rounded-lg border hover:bg-accent transition-colors">
              <div className="text-sm font-medium">Проверить pH</div>
              <div className="text-xs text-muted-foreground">Автоматически</div>
            </button>
            <button className="p-4 text-left rounded-lg border hover:bg-accent transition-colors">
              <div className="text-sm font-medium">Собрать урожай</div>
              <div className="text-xs text-muted-foreground">Готовые растения</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}