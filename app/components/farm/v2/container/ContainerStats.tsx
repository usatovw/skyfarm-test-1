import { ContainerStats as Stats } from '@/types/farming';
import { Card } from '@/components/ui/card';

interface ContainerStatsProps {
  stats: Stats;
}

export function ContainerStats({ stats }: ContainerStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card className="p-4">
        <div className="text-3xl font-bold">{stats.totalTrays}</div>
        <div className="text-sm text-muted-foreground">Всего поддонов</div>
      </Card>

      <Card className="p-4 bg-blue-50">
        <div className="text-3xl font-bold">{stats.occupied}</div>
        <div className="text-sm text-muted-foreground">
          Занято ({Math.round(stats.occupiedPercent)}%)
        </div>
      </Card>

      <Card className="p-4 bg-indigo-50">
        <div className="text-3xl font-bold">{stats.planned}</div>
        <div className="text-sm text-muted-foreground">
          Размещено ({Math.round(stats.plannedPercent)}%)
        </div>
      </Card>

      <Card className="p-4 bg-green-50">
        <div className="text-3xl font-bold">{stats.growing}</div>
        <div className="text-sm text-muted-foreground">
          Растет ({Math.round(stats.growingPercent)}%)
        </div>
      </Card>

      <Card className="p-4 bg-emerald-50">
        <div className="text-3xl font-bold">{stats.ready}</div>
        <div className="text-sm text-muted-foreground">
          Готово ({Math.round(stats.readyPercent)}%)
        </div>
      </Card>

      <Card className="p-4 bg-gray-50">
        <div className="text-3xl font-bold">{stats.free}</div>
        <div className="text-sm text-muted-foreground">
          Свободно ({Math.round(stats.freePercent)}%)
        </div>
      </Card>
    </div>
  );
}