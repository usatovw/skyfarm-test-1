'use client'

import { Layout } from '@/components/shared'
import { ContainerParameters } from '@/components/farm'
import { FarmManager } from '@/components/farm/v2/FarmManager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, Sprout } from 'lucide-react'

export default function FarmPage() {
  return (
    <Layout>
      <div className="p-6 pb-32">
        <div className="w-full space-y-6">
          <Tabs defaultValue="cultivation" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-card">
              <TabsTrigger
                value="cultivation"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Sprout className="h-4 w-4" />
                Выращивание
              </TabsTrigger>
              <TabsTrigger
                value="parameters"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BarChart3 className="h-4 w-4" />
                Параметры
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cultivation" className="mt-6">
              <FarmManager />
            </TabsContent>

            <TabsContent value="parameters" className="mt-6">
              <ContainerParameters />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  )
}