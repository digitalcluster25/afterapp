import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Activity, Target, BookOpen, BarChart3 } from "lucide-react"
import PageHeader from "@/components/PageHeader"
import PageWrapper from "@/components/PageWrapper"
import Section from "@/components/Section"

export const metadata: Metadata = {
  title: 'Карта сайта | :after',
  description: 'Полная карта сайта с навигацией по всем разделам системы управления здоровьем',
}

export default function SitemapPage() {
  const siteStructure = [
    {
      title: 'Велнес дашборд',
      path: '/',
      description: 'Главная страница со справочником показателей активности и их диапазонами значений',
      icon: BarChart3,
      category: 'Справочник',
      children: [
        {
          title: 'Параметры активности',
          path: '/',
          description: 'Просмотр всех велнес-параметров с диапазонами'
        }
      ]
    },
    {
      title: 'Велнес трекер',
      path: '/wellness-tracker',
      description: 'Система отслеживания персональных параметров здоровья с возможностью добавления значений',
      icon: Activity,
      category: 'Трекинг',
      children: [
        {
          title: 'Мои параметры',
          path: '/wellness-tracker',
          description: 'Список всех отслеживаемых параметров с последними значениями'
        },
        {
          title: 'Добавить параметр',
          path: '/wellness-tracker',
          description: 'Создание нового параметра для персонального отслеживания'
        },
        {
          title: 'Детали параметра',
          path: '/wellness-tracker/parameter/[id]',
          description: 'Подробная страница параметра с историей значений'
        }
      ]
    },
    {
      title: 'Цели',
      path: '/goals',
      description: 'Система постановки и управления личными целями с отслеживанием прогресса',
      icon: Target,
      category: 'Планирование',
      children: [
        {
          title: 'Мои цели',
          path: '/goals',
          description: 'Список всех поставленных целей со статусами'
        },
        {
          title: 'Добавить цель',
          path: '/goals',
          description: 'Создание новой персональной цели'
        },
        {
          title: 'Детали цели',
          path: '/goals/[id]',
          description: 'Подробная страница цели с историей активностей'
        }
      ]
    },
    {
      title: 'Блог',
      path: '/articles',
      description: 'Статьи о здоровье, активности и велнесе с научным обоснованием',
      icon: BookOpen,
      category: 'Образование',
      children: [
        {
          title: 'Все статьи',
          path: '/articles',
          description: 'Архив всех публикаций с категоризацией'
        },
        {
          title: 'Статья',
          path: '/articles/article/[id]',
          description: 'Подробное чтение отдельной статьи'
        }
      ]
    }
  ]


        return (
          <Section>
            <PageWrapper>
              <PageHeader title="Карта сайта" />

      {/* Main Content */}
      <div className="space-y-6">
        {siteStructure.map((section, index) => {
          const IconComponent = section.icon
          return (
            <Card key={section.path} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className="text-xl">{section.title}</CardTitle>
                        <Badge variant="outline">{section.category}</Badge>
                      </div>
                      <CardDescription className="text-base">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={section.path} className="flex items-center space-x-2">
                      <span>Перейти</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              
              {section.children && (
                <CardContent className="pt-0">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={`item-${index}`}>
                      <AccordionTrigger className="text-sm font-medium">
                        Подразделы ({section.children.length})
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                          {section.children.map((child, childIndex) => (
                            <Card key={childIndex} className="border-dashed">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-foreground mb-1">
                                      {child.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mb-3">
                                      {child.description}
                                    </p>
                                  </div>
                                  <Button asChild variant="ghost" size="sm" className="ml-2 h-8 w-8 p-0">
                                    <Link href={child.path}>
                                      <ArrowRight className="h-3 w-3" />
                                    </Link>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              )}
            </Card>
          )
        })}
             </div>
           </PageWrapper>
         </Section>
         )
}
