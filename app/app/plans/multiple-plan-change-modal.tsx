import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePermission } from "@/hook/use-permission";
import { useToast } from "@/hooks/use-toast";
import { ProjectService } from "@/services/project.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface MultiplePlanChangeModalProps {
  children: ReactNode
  selectedProjectsId: number[]
}

export default function MultiplePlanChangeModal ({
  children,
  selectedProjectsId
}: MultiplePlanChangeModalProps) {
  const { toast } = useToast()
  const { canEdit } = usePermission()

  const planChangeSchema = z.object({
    plan: z
      .string({ required_error: "O tipo do plano é obrigatório" })
  })

  const changePlanForm = useForm<z.infer<typeof planChangeSchema>>({
    resolver: zodResolver(planChangeSchema),
    defaultValues: {
      plan: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof planChangeSchema>) => {
    try {
      const {
        plan
      } = values

      const userCanEdit = canEdit()
      if (!userCanEdit) {
        toast({
          variant: "destructive",
          title: "Erro ao trocar plano",
          description: "Você não possui permissão para trocar o plano de um projeto. Entre em contato com o administrador.",
        })
        return
      }
      

      const updatePlanPromises = selectedProjectsId.map((id) => 
        ProjectService.updateProjectById(id, {
          role: plan.toLocaleLowerCase()
        })
      )

      toast({
        variant: "success",
        title: "Troca concluída!",
        description: "O plano foi trocado com sucesso.",
      })
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "Erro ao trocar o plano",
        description: "Ocorreu um erro ao fazer a troca do plano. Tente novamente.",
      })
    }
  }

  return (
    <Modal.Root>
      <Modal.OpenButton
        className="w-full"
      >
        { children }
      </Modal.OpenButton>
      <Modal.Container>
        <Modal.Header>
          <Modal.Title 
            title="Alterar assinatura do usuário"
          />
        </Modal.Header>
        <Modal.Content>
          <Form {...changePlanForm}>
            <form
              onSubmit={changePlanForm.handleSubmit(onSubmit)}
            >
              <div
                className="pb-6"
              >
                <FormField 
                  control={changePlanForm.control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Selecione o novo tipo de assinatura do usuário
                      </FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o plano" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Free">Free</SelectItem>
                          <SelectItem value="Pro">Pro</SelectItem>
                          <SelectItem value="Premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <Modal.Footer>
                <Button
                  className="text-white font-medium text-base py-3 px-11 bg-[#164F62] mt-1"
                >
                  Salvar alterações
                </Button>
              </Modal.Footer>
            </form>
          </Form>
        </Modal.Content>
      </Modal.Container>
    </Modal.Root>
  )
}