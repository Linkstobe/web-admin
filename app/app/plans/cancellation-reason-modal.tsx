import { Modal } from "@/components/modal";
import { ReactNode } from "react";

interface CancellationReasonModalProps {
  children: ReactNode
}

export default function CancellationReasonModal ({
  children
}: CancellationReasonModalProps) {
  return (
    <Modal.Root>
      <Modal.OpenButton
      >
        { children }
      </Modal.OpenButton>
      <Modal.Container>
        <Modal.Header>
          <Modal.Title 
            title="Cancelamento"
          />
        </Modal.Header>
        <Modal.Content>
          <div 
            className="flex flex-col gap-8"
          >
            <p
              className="text-center text-[#404A59] font-medium text-base"
            >
              O usuário relatou o seguinte motivo para o cancelamento:
            </p>

            <div
              className="border border-[#DAE0E7] shadow-sm p-8 rounded-md"
            >
              <ul
                className="flex flex-col items-center gap-4"
              >
                <li className="text-[#404A59] font-medium text-base">
                  Dificuldade de utilizar o sistemas
                </li>
                <li className="text-[#404A59] font-medium text-base">
                  Não achou útil
                </li>
                <li className="text-[#404A59] font-medium text-base">
                  Sistema com lentidão
                </li>
              </ul>
            </div>
          </div>
        </Modal.Content>
      </Modal.Container>
    </Modal.Root>
  )
}