import { DialogTitle } from "../ui/dialog";

interface ModalTitleProps {
  title: string
}

export default function ModalTitle ({
  title
}: ModalTitleProps) {
  return (
    <DialogTitle
      className="text-[#164F62] text-xl"
    >
      { title }
    </DialogTitle>
  )
}