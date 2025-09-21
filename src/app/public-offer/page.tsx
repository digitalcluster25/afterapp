import { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import PageWrapper from '@/components/PageWrapper'
import Section from '@/components/Section'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: 'Публичная оферта | :after',
  description: 'Публичная оферта системы управления здоровьем :after',
}

export default function PublicOfferPage() {
  return (
    <Section>
      <PageWrapper>
        <PageHeader title="Публичная оферта" />
        
        <Card>
          <CardHeader>
            <CardTitle>Договор публичной оферты</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">1. Общие положения</h2>
              <p className="text-muted-foreground">
                Настоящий договор является публичной офертой в соответствии со статьей 437 Гражданского кодекса Российской Федерации и определяет условия использования сервиса ":after" (далее — "Сервис").
              </p>
              <p className="text-muted-foreground">
                Используя Сервис, Пользователь соглашается с условиями настоящего договора. Если Пользователь не согласен с какими-либо условиями договора, он должен прекратить использование Сервиса.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">2. Предмет договора</h2>
              <p className="text-muted-foreground">
                Предметом настоящего договора является предоставление Пользователю доступа к функциональным возможностям Сервиса ":after" для отслеживания показателей здоровья и активности, постановки целей и ведения журнала активности.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">3. Права и обязанности сторон</h2>
              <div className="space-y-3">
                <h3 className="text-lg font-medium">3.1. Права и обязанности Пользователя:</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Пользователь имеет право использовать Сервис в соответствии с его функциональным назначением</li>
                  <li>Пользователь обязуется предоставлять достоверную информацию о своих показателях здоровья</li>
                  <li>Пользователь несет ответственность за конфиденциальность своих данных</li>
                  <li>Пользователь обязуется не нарушать права третьих лиц при использовании Сервиса</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium">3.2. Права и обязанности Администрации:</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Администрация предоставляет доступ к Сервису на условиях, указанных в настоящем договоре</li>
                  <li>Администрация обязуется обеспечивать конфиденциальность персональных данных Пользователя</li>
                  <li>Администрация имеет право вносить изменения в функциональность Сервиса</li>
                  <li>Администрация имеет право приостановить или прекратить работу Сервиса при технических работах</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">4. Конфиденциальность</h2>
              <p className="text-muted-foreground">
                Администрация обязуется не разглашать персональные данные Пользователя третьим лицам, за исключением случаев, предусмотренных действующим законодательством Российской Федерации.
              </p>
              <p className="text-muted-foreground">
                Пользователь соглашается на обработку своих персональных данных в целях предоставления услуг Сервиса.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">5. Ограничение ответственности</h2>
              <p className="text-muted-foreground">
                Сервис предоставляется "как есть". Администрация не гарантирует, что Сервис будет работать бесперебойно или без ошибок.
              </p>
              <p className="text-muted-foreground">
                Администрация не несет ответственности за решения, принятые Пользователем на основе данных, полученных с помощью Сервиса.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">6. Изменения в договоре</h2>
              <p className="text-muted-foreground">
                Администрация имеет право вносить изменения в настоящий договор. Изменения вступают в силу с момента их публикации на сайте Сервиса.
              </p>
              <p className="text-muted-foreground">
                Продолжение использования Сервиса после внесения изменений означает согласие Пользователя с новыми условиями.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">7. Заключительные положения</h2>
              <p className="text-muted-foreground">
                Настоящий договор регулируется и толкуется в соответствии с законодательством Российской Федерации.
              </p>
              <p className="text-muted-foreground">
                Все споры по настоящему договору разрешаются в соответствии с действующим законодательством Российской Федерации.
              </p>
            </div>

            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}
              </p>
            </div>
          </CardContent>
        </Card>
      </PageWrapper>
    </Section>
  )
}
