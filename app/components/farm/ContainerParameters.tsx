'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Pause, MoreVertical, ChevronUp } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function ContainerParameters() {
  const [stagesExpanded, setStagesExpanded] = useState(true);
  const [selectedParameter, setSelectedParameter] = useState('temperature');
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  const growthStages = [
    { name: 'Проращивание', days: '7 дней', status: 'completed', color: 'bg-green-600' },
    { name: 'Рассада', days: '14 дней', status: 'current', color: 'bg-blue-600' },
    { name: 'Вегетация', days: '21 дней', status: 'upcoming', color: 'bg-gray-400' },
    { name: 'Сбор урожая', days: '30 дней', status: 'upcoming', color: 'bg-gray-400' }
  ];

  const parameters = [
    { 
      name: 'Тем-ра воздуха', 
      value: '22.5°C', 
      target: 'Цель: 20-25°C', 
      deviation: '-0.5°C',
      deviationColor: 'text-green-600',
      selected: selectedParameter === 'temperature',
      borderColor: selectedParameter === 'temperature' ? 'border-blue-600 border-2' : '',
      icon: '🌡️'
    },
    { 
      name: 'Влажность', 
      value: '65%', 
      target: 'Цель: 60-70%', 
      deviation: '+2%',
      deviationColor: 'text-green-600',
      selected: false,
      borderColor: '',
      icon: '💧'
    },
    { 
      name: 'Углекислый газ', 
      value: '950 ppm', 
      target: 'Цель: 800-1200ppm', 
      deviation: '-50 ppm',
      deviationColor: 'text-yellow-600',
      selected: false,
      borderColor: 'border-l-yellow-400 border-l-4',
      icon: '🫧'
    },
    { 
      name: 'Освещенность', 
      value: '250 PPFD', 
      target: 'Цель: 200-400PPFD', 
      deviation: '+10 PPFD',
      deviationColor: 'text-green-600',
      selected: false,
      borderColor: '',
      icon: '💡'
    },
    { 
      name: 'Тем-ра раствора', 
      value: '21°C', 
      target: 'Цель: 18-24°C', 
      deviation: '-1°C',
      deviationColor: 'text-green-600',
      selected: false,
      borderColor: '',
      icon: '🌡️'
    },
    { 
      name: 'Раствор в баке', 
      value: '85%', 
      target: 'Цель: >70%', 
      deviation: '-15%',
      deviationColor: 'text-red-600',
      selected: false,
      borderColor: 'border-l-red-500 border-l-4',
      icon: '🧪'
    },
    { 
      name: 'Чистая вода в баке', 
      value: '92%', 
      target: 'Цель: >80%', 
      deviation: '+12%',
      deviationColor: 'text-green-600',
      selected: false,
      borderColor: '',
      icon: '💧'
    },
    { 
      name: 'pH (Вход)', 
      value: '6.2', 
      target: 'Цель: 5.5-6.5', 
      deviation: '+0.2',
      deviationColor: 'text-green-600',
      selected: false,
      borderColor: '',
      icon: '🧪'
    },
    { 
      name: 'pH (Выход)', 
      value: '6.0', 
      target: 'Цель: 5.5-6.5', 
      deviation: '0',
      deviationColor: 'text-green-600',
      selected: false,
      borderColor: '',
      icon: '🧪'
    },
    { 
      name: 'EC/TDS (Вход)', 
      value: '1.8', 
      target: 'Цель: 1.2-2.0', 
      deviation: '+0.3',
      deviationColor: 'text-green-600',
      selected: false,
      borderColor: '',
      icon: '⚡'
    },
    { 
      name: 'EC/TDS (Выход)', 
      value: '1.5', 
      target: 'Цель: 1.0-1.8', 
      deviation: '+0.2',
      deviationColor: 'text-green-600',
      selected: false,
      borderColor: '',
      icon: '⚡'
    },
    { 
      name: 'VPD', 
      value: '0.8', 
      target: 'Цель: 0.6-1.0', 
      deviation: '+0.1',
      deviationColor: 'text-green-600',
      selected: false,
      borderColor: '',
      icon: '🌿'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Заголовок с действиями */}
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground">Контейнер № 41-i2f</h2>
            <p className="text-sm text-muted-foreground">Режим: Базилик</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              Приостановить
              <Pause className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Изменить режим</DropdownMenuItem>
                <DropdownMenuItem>Экспорт данных</DropdownMenuItem>
                <DropdownMenuItem>Настройки</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Стадии роста */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Стадии роста</h3>
              <p className="text-sm text-muted-foreground">День 8 из 72. Текущая стадия: Рассада (2 из 4)</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setStagesExpanded(!stagesExpanded)}
              className="text-muted-foreground"
            >
              {stagesExpanded ? 'Свернуть' : 'Развернуть'}
              <ChevronUp className={`ml-2 h-4 w-4 transition-transform ${!stagesExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          
          {stagesExpanded && (
            <div className="flex items-center justify-between">
              {growthStages.map((stage, index) => (
                <div key={stage.name} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium text-white
                      ${stage.status === 'completed' ? 'bg-green-600' : 
                        stage.status === 'current' ? 'bg-blue-600' : 'bg-gray-400'}
                    `}>
                      {stage.status === 'completed' ? '✓' : index + 1}
                    </div>
                    <div className="mt-2 text-center">
                      <p className={`text-sm font-medium ${
                        stage.status === 'completed' ? 'text-green-600' : 
                        stage.status === 'current' ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {stage.name}
                      </p>
                      <p className={`text-xs ${
                        stage.status === 'completed' ? 'text-green-500' : 
                        stage.status === 'current' ? 'text-blue-500' : 'text-gray-400'
                      }`}>
                        {stage.days}
                      </p>
                    </div>
                  </div>
                  {index < growthStages.length - 1 && (
                    <div className={`
                      flex-1 h-0.5 mx-4 min-w-[100px]
                      ${stage.status === 'completed' ? 'bg-green-600' : 'bg-gray-300'}
                    `} />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Параметры */}
      <div className="grid grid-cols-4 gap-4">
        {parameters.map((param) => (
          <Card 
            key={param.name}
            className={`cursor-pointer transition-all hover:shadow-md ${param.borderColor}`}
            onClick={() => setSelectedParameter(param.name === 'Тем-ра воздуха' ? 'temperature' : param.name)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{param.icon}</span>
                <p className="text-sm text-muted-foreground">{param.name}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-lg font-bold text-foreground">{param.value}</p>
                <p className="text-xs text-muted-foreground">{param.target}</p>
                <p className={`text-xs ${param.deviationColor}`}>{param.deviation}</p>
              </div>
              <div className="mt-2 flex gap-0.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex-1 bg-gray-200 h-6" style={{ height: `${Math.random() * 24 + 8}px` }} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* График температуры */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Температура</h3>
            <div className="flex bg-card border rounded-md">
              {['1 час', '24 часа', '7 дней'].map((period, index) => (
                <Button
                  key={period}
                  variant={period === '7 дней' ? 'default' : 'ghost'}
                  size="sm"
                  className={`rounded-none ${index === 0 ? 'rounded-l-md' : index === 2 ? 'rounded-r-md' : ''}`}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="h-64 bg-gradient-to-b from-blue-50 to-white rounded-lg p-4 relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm text-muted-foreground py-4">
              <span>25</span>
              <span>24</span>
              <span>23</span>
              <span>22</span>
              <span>21</span>
            </div>
            
            {/* Chart area with mock line */}
            <div className="ml-12 h-full relative">
              <svg className="w-full h-full" viewBox="0 0 800 200">
                <path
                  d="M0,120 Q100,100 200,110 T400,80 T600,90 T800,110"
                  stroke="rgb(28, 100, 242)"
                  strokeWidth="3"
                  fill="none"
                />
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgb(28, 100, 242)" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="rgb(28, 100, 242)" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path
                  d="M0,120 Q100,100 200,110 T400,80 T600,90 T800,110 L800,200 L0,200 Z"
                  fill="url(#chartGradient)"
                />
              </svg>
            </div>
            
            {/* X-axis labels */}
            <div className="flex justify-between text-sm text-muted-foreground mt-2 ml-12">
              <span>08 августа</span>
              <span>09 августа</span>
              <span>10 августа</span>
              <span>11 августа</span>
              <span>12 августа</span>
              <span>13 августа</span>
              <span>14 августа</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}