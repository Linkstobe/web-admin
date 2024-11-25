import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BadgeInfo, Calendar, Crown, Mail, Phone, TriangleAlert, User } from "lucide-react";
import { HTMLAttributes, ReactNode } from "react";

interface DetailedComplaintModalProps extends HTMLAttributes<HTMLDataElement> {
  children: ReactNode
}

export default function DetailedComplaintModal ({
  children
}: DetailedComplaintModalProps) {
  return (
    <Modal.Root>
      <Modal.OpenButton>
        { children }
      </Modal.OpenButton>
      <Modal.Container
        className="max-h-[95%] overflow-y-auto"
      >
        <Modal.Header>
          <Modal.Title title="Dados da denúncia" />
        </Modal.Header>
        <Modal.Content>
          <div
            className="flex flex-col gap-3"
          >
            <div
              className="flex flex-col gap-2"
            >
              <h2
                className="font-semibold text-lg"
              >
                Dados do denunciado
              </h2>

              <div
                className="flex flex-col sm:flex-row sm:gap-2 sm:items-center"
              >
                <div>
                  <img 
                    src="https://github.com/cvitorandrade.png"
                    alt=""
                    className="rounded-full border size-12 justify-self-center"
                  />
                </div>
                
                <div
                  className="flex flex-col gap-2 sm:gap-0"
                >
                  <h4
                    className="font-medium text-lg text-center sm:text-start"
                  >
                    Nome do denunciado
                  </h4>
                  <div
                    className="flex flex-col gap-2 sm:flex-row sm:items-center"
                  >
                    <div
                      className="flex gap-1 items-center"
                    >
                      <Mail 
                        size={15}
                      />

                      <span
                        className="text-sm"
                      >
                        dev.cvitor@gmail.com
                      </span>
                    </div>

                    <div
                      className="flex gap-1 items-center"
                    >
                      <Phone 
                        size={15}
                      />

                      <span
                        className="text-sm"
                      >
                        +55 88 99887766554
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              <div
                className="flex gap-2 items-center"
              >
                <BadgeInfo 
                  size={20}
                />

                <h4
                  className="font-semibold"
                >
                  Linkstobe/
                </h4>

                <span>
                  linkstobe
                </span>
              </div>

              <div
                className="flex gap-2 items-center"
              >
                <Calendar 
                  size={20}
                />

                <h4
                  className="font-semibold"
                >
                  Criado em:
                </h4>

                <span>
                  12/08/2024
                </span>
              </div>

              <div
                className="flex gap-2 items-center"
              >
                <Crown 
                  size={20}
                />

                <h4
                  className="font-semibold"
                >
                  Plano:
                </h4>

                <span>
                  Free
                </span>
              </div>
            </div>

            <Separator />

            <div
              className="flex flex-col gap-2"
            >
              <h2
                className="font-semibold text-lg"
              >
                Dados do denuciante
              </h2>

              <div
                className="flex gap-2 items-center"
              >
                <User 
                  size={20}
                />

                <h4
                  className="font-semibold"
                >
                  Nome:
                </h4>

                <span>
                  Carlos Vitor
                </span>

              </div>

              <div
                className="flex gap-2 items-center flex-wrap"
              >
                <Mail 
                  size={20}
                />

                <h4
                  className="font-semibold whitespace-nowrap"
                >
                  Email:
                </h4>

                <span
                  className="whitespace-nowrap"
                >
                  dev.cvitor@gmail.com
                </span>
              </div>
            </div>

            <Separator />

            <div
              className="flex flex-col gap-2"
            >
              <h2
                className="font-semibold text-lg"
              >
                Dados da denúncia
              </h2>

              <div
                className="flex gap-2 items-center flex-wrap"
              >
                <TriangleAlert 
                  size={20}
                />

                <h4
                  className="font-semibold whitespace-nowrap"
                >
                  Tipo de atividade abusiva:
                </h4>

                <span
                  className="whitespace-nowrap"
                >
                  O projeto contém apologia a algo
                </span>
              </div>

              <div
                className="flex gap-2 items-center"
              >
                <Calendar 
                  size={20}
                />

                <h4
                  className="font-semibold"
                >
                  Data da denúncia:
                </h4>

                <span>
                  23/11/2024
                </span>

              </div>

              <div
                className="bg-neutral-100 p-3 rounded-lg"
              >
                <h3
                  className="font-medium text-stone-700"
                >
                  Comentário
                </h3>

                <p
                  className="font-medium text-sm"
                >
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quas nulla sequi minus, illo veritatis aliquam esse facere eius illum, earum enim voluptatem temporibus optio modi laudantium, voluptatum eligendi excepturi perferendis.
                </p>
              </div>
            </div>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <Modal.CloseButton>
            <Button
              className="text-white font-medium text-base py-3 px-11 bg-[#164F62] mt-1"
            >
              Fechar
            </Button>
          </Modal.CloseButton>
        </Modal.Footer>
      </Modal.Container>
    </Modal.Root>
  )
}