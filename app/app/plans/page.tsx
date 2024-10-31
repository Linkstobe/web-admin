import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { PlansTable } from "./plans-table";

import CancellationReasonModal from "./cancellation-reason-modal";
import ActiveSubscription from "./active-subscriptions";
import SubscriptionConversion from "./subscription-conversion";

export default async function Plans () {

  return (
    <div
      className="flex flex-col gap-4 pb-20"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 bg-white p-2 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold tracking-tight">Planos</h2>
      </div>

      <div
        className="2xl:hidden"
      >
        <SubscriptionConversion 
          chartClassName="h-[400px] w-full"
        />
      </div>

      <div
        className="grid grid-cols-2 2xl:grid-cols-3 gap-4"
      >
        <ActiveSubscription />

        <SubscriptionConversion 
          className="hidden 2xl:block"
          chartClassName="h-[400px]"
        />

        <Card>
          <CardHeader>
            <CardTitle>
              Cancelamentos
            </CardTitle>
            <CardDescription>
              Clique em um usuário para ver o motivo do seu cancelamento
            </CardDescription>
          </CardHeader>

          <CardContent
            className="p-0"
          >
            <ul
              className="flex flex-col gap-1 px-4"
            >
              <CancellationReasonModal>
                <li
                  className="text-sm text-start px-2 rounded-lg transition-all duration-700 font-medium cursor-pointer hover:bg-[#D2D2D2]"
                >
                  <span className="block py-2">Luiz Antônio cancelou o <span className="text-[#164F62] font-bold">Plano Pro</span></span>
                  <div className="w-[90%] border border-[#D9D9D9] m-auto rounded-md"></div>
                </li>
              </CancellationReasonModal>              
              <CancellationReasonModal>
                <li
                  className="text-sm px-2 text-start rounded-lg transition-all duration-700 font-medium cursor-pointer hover:bg-[#D2D2D2]"
                >
                  <span className="block py-2">Ana Beatriz Giovanni cancelou o <span className="text-[#299FC7] font-bold">Plano Premium</span></span>
                  <div className="w-[90%] border border-[#D9D9D9] m-auto rounded-md"></div>
                </li>
              </CancellationReasonModal>
              <CancellationReasonModal>
                <li
                  className="text-sm px-2 text-start rounded-lg transition-all duration-700 font-medium cursor-pointer hover:bg-[#D2D2D2]"
                >
                  <span className="block py-2">Gisele Tiffole cancelou o <span className="text-[#299FC7] font-bold">Plano Premium</span></span>
                  <div className="w-[90%] border border-[#D9D9D9] m-auto rounded-md"></div>
                </li>
              </CancellationReasonModal>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div>
        <PlansTable />
      </div>

      {/* <div>
        <Table.Root>
          <Table.TopSection>
            <Table.Title 
              title="Cupons ativos"
            />
          </Table.TopSection>

          <Table.Content>
            <Table.HeaderSection>
              <Table.Row>
                <Table.HeaderItem
                  title="Cupom"
                />
                <Table.HeaderItem
                  title="Associado à"
                />
                <Table.HeaderItem
                  title="Data de expiração"
                />
                <Table.HeaderItem
                  title="Desconto"
                />
                <Table.HeaderItem
                  title="Limitações"
                />
                <Table.HeaderItem
                  title=""
                />
              </Table.Row>
            </Table.HeaderSection>

            <Table.BodySection>
              <Table.Row>
                <Table.BodyItem 
                  text="linkstobe"
                />
                <Table.BodyItem 
                  text="linkstobe"
                />
                <Table.BodyItem 
                  text="31/12/2035"
                />
                <Table.BodyItem 
                  text="10%"
                />
                <Table.BodyItem 
                  text="Válido para novos usuários"
                />

                <Table.BodyItem 
                  text="action"
                />
              </Table.Row>
            </Table.BodySection>

          </Table.Content>
        </Table.Root>
      </div> */}

      {/* <div
        className="flex flex-col p-2 rounded-lg gap-4"
      >
        <h3
          className="text-xl font-bold"
        >
          Usuários
        </h3>

        <div
          className="sm:grid sm:grid-cols-3 gap-2"
        >
          <SimpleMetricCard.Root
            className="bg-cyan-900"
          >
            <SimpleMetricCard.TextSection>
              <SimpleMetricCard.Title
                title="Total de usuários"
                className="text-white"
              />
              <SimpleMetricCard.Value 
                value="678"
                className="text-white"
              />
            </SimpleMetricCard.TextSection>

            <SimpleMetricCard.Icon
              icon={Users}
              className="bg-cyan-800"
            />
          </SimpleMetricCard.Root>
        </div>

        <div
          className="flex flex-col sm:grid sm:grid-cols-3 gap-2"
        >
          <SimpleMetricCard.Root>
            <SimpleMetricCard.TextSection>
              <SimpleMetricCard.Title
                title="Plano"
              >
                <SimpleMetricCard.TitleAdditionalInfo
                  text="gratuito"
                />
              </SimpleMetricCard.Title>
              <SimpleMetricCard.Value 
                value="593"
              >
                <SimpleMetricCard.ValueAdditionalInfo
                  text="(89%)"
                />
              </SimpleMetricCard.Value>
            </SimpleMetricCard.TextSection>

            <SimpleMetricCard.Icon
              className="bg-yellow-400"
              icon={Crown}
            />
          </SimpleMetricCard.Root>

          <SimpleMetricCard.Root>
            <SimpleMetricCard.TextSection>
              <SimpleMetricCard.Title
                title="Plano"
              >
                <SimpleMetricCard.TitleAdditionalInfo
                  text="pro"
                />
              </SimpleMetricCard.Title>
              <SimpleMetricCard.Value 
                value="85"
              >
                <SimpleMetricCard.ValueAdditionalInfo
                  text="(9%)"
                />
              </SimpleMetricCard.Value>
            </SimpleMetricCard.TextSection>

            <SimpleMetricCard.Icon
              className="bg-purple-700"
              icon={Crown}
            />
          </SimpleMetricCard.Root>

          <SimpleMetricCard.Root>
            <SimpleMetricCard.TextSection>
              <SimpleMetricCard.Title
                title="Plano"
              >
                <SimpleMetricCard.TitleAdditionalInfo
                  text="premium"
                />
              </SimpleMetricCard.Title>
              <SimpleMetricCard.Value 
                value="14"
              >
                <SimpleMetricCard.ValueAdditionalInfo
                  text="(2%)"
                />
              </SimpleMetricCard.Value>
            </SimpleMetricCard.TextSection>

            <SimpleMetricCard.Icon
              className="bg-cyan-800"
              icon={Crown}
            />
          </SimpleMetricCard.Root>
          
        </div>
        
        <SimpleLineChart />

      </div>

      <div
        className="flex flex-col p-2 rounded-lg gap-4"
      >
        <h3
          className="text-xl font-bold"
        >
          Projetos
        </h3>

        <div
          className="flex flex-col sm:grid sm:grid-cols-3 gap-2"
        >
          <SimpleMetricCard.Root
            className="bg-cyan-900"
          >
            <SimpleMetricCard.TextSection>
              <SimpleMetricCard.Title
                title="Total de usuários"
                className="text-white"
              />
              <SimpleMetricCard.Value 
                value="678"
                className="text-white"
              />
            </SimpleMetricCard.TextSection>

            <SimpleMetricCard.Icon
              icon={Users}
              className="bg-cyan-800"
            />
          </SimpleMetricCard.Root>
        </div>

        <div
          className="flex flex-col sm:grid sm:grid-cols-3 gap-2"
        >
          <SimpleMetricCard.Root>
            <SimpleMetricCard.TextSection>
              <SimpleMetricCard.Title
                title="Plano"
              >
                <SimpleMetricCard.TitleAdditionalInfo
                  text="gratuito"
                />
              </SimpleMetricCard.Title>
              <SimpleMetricCard.Value 
                value="593"
              >
                <SimpleMetricCard.ValueAdditionalInfo
                  text="(89%)"
                />
              </SimpleMetricCard.Value>
            </SimpleMetricCard.TextSection>

            <SimpleMetricCard.Icon
              className="bg-yellow-400"
              icon={Crown}
            />
          </SimpleMetricCard.Root>

          <SimpleMetricCard.Root>
            <SimpleMetricCard.TextSection>
              <SimpleMetricCard.Title
                title="Plano"
              >
                <SimpleMetricCard.TitleAdditionalInfo
                  text="pro"
                />
              </SimpleMetricCard.Title>
              <SimpleMetricCard.Value 
                value="85"
              >
                <SimpleMetricCard.ValueAdditionalInfo
                  text="(9%)"
                />
              </SimpleMetricCard.Value>
            </SimpleMetricCard.TextSection>

            <SimpleMetricCard.Icon
              className="bg-purple-700"
              icon={Crown}
            />
          </SimpleMetricCard.Root>

          <SimpleMetricCard.Root>
            <SimpleMetricCard.TextSection>
              <SimpleMetricCard.Title
                title="Plano"
              >
                <SimpleMetricCard.TitleAdditionalInfo
                  text="premium"
                />
              </SimpleMetricCard.Title>
              <SimpleMetricCard.Value 
                value="14"
              >
                <SimpleMetricCard.ValueAdditionalInfo
                  text="(2%)"
                />
              </SimpleMetricCard.Value>
            </SimpleMetricCard.TextSection>

            <SimpleMetricCard.Icon
              className="bg-cyan-800"
              icon={Crown}
            />
          </SimpleMetricCard.Root>
          
        </div>
      </div> */}

    </div>
  )
}