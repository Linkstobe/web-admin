import { ReactNode } from "react"
import { Modal } from "./modal"
import { Button } from "./ui/button"

interface ConfirmationModalProps {
  children: ReactNode
  onConfirm: () => void
  title: string
  description: string
}
export default function ConfirmationModal ({
  children,
  onConfirm,
  title,
  description
}: ConfirmationModalProps) {
  return (
    <Modal.Root>
      <Modal.OpenButton>
        { children }
      </Modal.OpenButton>
      <Modal.Container>
        <Modal.Header>
          <Modal.Title 
            title={title}
          />
        </Modal.Header>
        <Modal.Content>
          <p>{ description }</p>
        </Modal.Content>
        <Modal.Footer>
          <Modal.CloseButton>
            <Button
              className="text-white font-medium text-base py-3 px-11 bg-red-500 mt-1"
            >
              Cancelar
            </Button>
          </Modal.CloseButton>
          <Button
            onClick={onConfirm}
            className="text-white font-medium text-base py-3 px-11 bg-[#164F62] mt-1"
          >
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal.Container>
    </Modal.Root>
  )
}