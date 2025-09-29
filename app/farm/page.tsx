'use client'

import { Layout } from '@/components/shared'
import { ContainerParameters, GrowthManagement } from '@/components/farm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, Sprout } from 'lucide-react'

export default function FarmPage() {
  return (
    <Layout>
      <div className="p-6">
        <div className="w-full space-y-6">
          <Tabs defaultValue="parameters" className="w-full">
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
      </div>
    </Layout>
  )
}