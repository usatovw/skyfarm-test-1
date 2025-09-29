'use client'

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ContainerParameters from './ContainerParameters';
import GrowthManagement from './GrowthManagement';
import { BarChart3, Sprout } from 'lucide-react';

export default function FarmingTabs() {
  const [activeTab, setActiveTab] = useState('parameters');

  return (
    <div className="w-full space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-card">
          <TabsTrigger 
            value="parameters" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <BarChart3 className="h-4 w-4" />
            Параметры
          </TabsTrigger>
          <TabsTrigger 
            value="growth-management"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Sprout className="h-4 w-4" />
            Управление выращиванием
          </TabsTrigger>
        </TabsList>

        <TabsContent value="parameters" className="mt-6">
          <ContainerParameters />
        </TabsContent>

        <TabsContent value="growth-management" className="mt-6">
          <GrowthManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}