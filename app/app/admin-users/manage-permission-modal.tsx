'use client'

import { Modal } from "@/components/modal"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePermission } from "@/hook/use-permission"
import { useToast } from "@/hooks/use-toast"
import { UserService } from "@/services/user.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReactNode } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface ManagePermissionModalProps {
  children: ReactNode
  userId: string
}

export default function ManagePermissionModal ({
  children,
  userId
}: ManagePermissionModalProps) {
  const { toast } = useToast()
  const { canEdit } = usePermission()

  const managePermissionSchema = z.object({
    permission: z
      .string({
        required_error: "Escolher uma permissão é obrigatório",
      })
  })

  const managePermissionForm = useForm<z.infer<typeof managePermissionSchema>>({
    resolver: zodResolver(managePermissionSchema),
    defaultValues: {
      permission: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof managePermissionSchema>) => {
    try {
      const {
        permission
      } = values
      
      const userCanEdit = canEdit()
      if (!userCanEdit) {
        toast({
          variant: "destructive",
          title: "Erro ao modificar permissão",
          description: "Você não possui permissão para modificar as permissões de um usuário. Entre em contato com o administrador.",
        })
        return
      }

      await UserService.updateUserById(userId, {
        permission: permission === "Sem permissões" ? "" : (permission !== "Somente ver" ? "editar" : "ver")
      })

      toast({
        variant: "success",
        title: "Permissão atualizada!",
        description: "A permissão do administrador foi atualizada com sucesso.",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar permissão",
        description: "Ocorreu um erro ao atualizar a permissão. Tente novamente.",
      })
    }
  }

  return (
    <Modal.Root>
      <Modal.OpenButton>
        { children }
      </Modal.OpenButton>
      <Modal.Container>
        <Modal.Header>
          <Modal.Title 
            title="Gerênciar permissões"
          />
        </Modal.Header>
        <Modal.Content>
          <Form {...managePermissionForm}>
            <form
              onSubmit={managePermissionForm.handleSubmit(onSubmit)}
            >
              <div className="pb-6">
                <FormField
                  control={managePermissionForm.control}
                  name="permission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Selecione a permissão
                      </FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                        }}
                      >
                        <FormControl className="bg-white">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de permissão" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sem permissões">Sem permissões</SelectItem>
                          <SelectItem value="Somente ver">Somente ver</SelectItem>
                          <SelectItem value="editar">Ver e editar</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <Modal.Footer>
                <Button
                  type="submit"
                  className="text-white font-medium text-base py-3 px-11 bg-[#164F62] mt-1"
                >
                  Salvar
                </Button>
              </Modal.Footer>
            </form>
          </Form>
        </Modal.Content>
      </Modal.Container>
    </Modal.Root>
  )
}