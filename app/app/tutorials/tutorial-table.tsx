'use client'
import { Table } from "@/components/table";
import EditTutorialModal from "./edit-tutorial-modal";
import { Edit } from "lucide-react";
import { TutorialExamplesService } from "@/services/turorial-examples.service";
import { useEffect, useState } from "react";
import { ITutorialExamples } from "@/interfaces/ITutorialExamples";

export default function TutorialTable () {
  const [tutorialExamples, setTutorialExamples] = useState<ITutorialExamples[]>([])
  const onGetTutorials = async () => {
    try {
      const tutorials = await TutorialExamplesService.getAll()
      setTutorialExamples(tutorials)
    } catch (error) {
      console.log("TutorialTable - onGetTutorials: ", error)
    }
  }

  useEffect(() => {
    onGetTutorials()
  }, [])

  return (
    <Table.Root>
      <Table.TopSection>
        <Table.Title
          title="Tutoriais"
        />
      </Table.TopSection>
      <Table.Content>
        <Table.HeaderSection>
          <Table.Row>
            <Table.HeaderItem title="Tela do sistema" />
            {/* <Table.HeaderItem title="Quantidade de cliques" /> */}
            <Table.HeaderItem title="Título" />
            <Table.HeaderItem title="Descrição" />
            <Table.HeaderItem title="" />
          </Table.Row>
        </Table.HeaderSection>

        <Table.BodySection>
          {
            tutorialExamples.map(({ 
              id, 
              tutorial_title, 
              tutorial_description, 
              tutorial_reference_page,
              tutorial_link_midia
            }) => (
              <Table.Row key={id}>
                <Table.BodyItem text={tutorial_reference_page} />
                <Table.BodyItem text={tutorial_title} />
                <Table.BodyItem text={tutorial_description} />
                <Table.BodyItem>
                  <div className="flex justify-end">
                    <EditTutorialModal
                      tutorialId={id}
                      tutorialTitle={tutorial_title}
                      tutorialDescription={tutorial_description}
                      tutorialVideoUrl={tutorial_link_midia}
                      updateFunction={onGetTutorials}
                    >
                      <Table.BasicAction
                        tooltipText="Editar"
                        icon={Edit}
                        className="text-[#767676]"
                      />
                    </EditTutorialModal>
                  </div>
                </Table.BodyItem>
              </Table.Row>
            ))
          }
        </Table.BodySection>
      </Table.Content>
    </Table.Root>
  )
}