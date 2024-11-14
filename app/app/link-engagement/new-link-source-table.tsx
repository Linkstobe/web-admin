import { Table } from "@/components/table";
import { Ellipsis } from "lucide-react";

export default function NewLinkSourceTable () {
  return (
    <Table.Root>
      <Table.TopSection>
        <Table.Title 
          title="Origem de Novos Links"
        />

        <Table.TopButton 
          icon={Ellipsis}
          className="bg-transparent"
        />

      </Table.TopSection>
      <div
        className="grid grid-cols-2"
      >
        <Table.Content>
          <Table.HeaderSection>
            <Table.Row>
              <Table.HeaderItem title="Posição" />
              <Table.HeaderItem title="Link do usuário" />
              <Table.HeaderItem title="Novos Links" />
            </Table.Row>
          </Table.HeaderSection>

          <Table.BodySection>
            <Table.Row>
              <Table.BodyItem text="1°" />
              <Table.BodyItem text="/dev-cvitor" />
              <Table.BodyItem text="100" />
            </Table.Row>
          </Table.BodySection>
        </Table.Content>

        <Table.Content>
          <Table.HeaderSection>
            <Table.Row>
              <Table.HeaderItem title="Posição" />
              <Table.HeaderItem title="Link do usuário" />
              <Table.HeaderItem title="Novos Links" />
            </Table.Row>
          </Table.HeaderSection>

          <Table.BodySection>
            <Table.Row>
              <Table.BodyItem text="2°" />
              <Table.BodyItem text="/dev-cvitor" />
              <Table.BodyItem text="100" />
            </Table.Row>
          </Table.BodySection>
        </Table.Content>
      </div>
    </Table.Root>
  )
}