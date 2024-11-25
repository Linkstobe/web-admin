import { Modal } from "@/components/modal"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReactNode } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { UserService } from "@/services/user.service"
import { ProjectService } from "@/services/project.service"
import { useToast } from "@/hooks/use-toast"
import { usePermission } from "@/hook/use-permission"

interface UserInfoChangeModalProps {
  children: ReactNode
  userId: string
  projectId: string
  name: string
  linkstoBe: string
  email: string
  cellphone: string
}

export default function UserInfoChangeModal ({
  children,
  name,
  linkstoBe,
  email,
  cellphone,
  userId,
  projectId
}: UserInfoChangeModalProps) {
  const { toast } = useToast()
  const { canEdit } = usePermission()

  const userInfoSchema = z.object({
    name: z
      .string({ required_error: "O nome é obrigatório" })
      .min(3, "O nome deve ter no mínimo 3 caracteres"),
    linkstoBe: z
      .string({ required_error: "O link é obrigatório" })
      .min(3, "O link deve ter no mínimo 3 caracteres"),
    email: z
      .string({ required_error: "O email é obrigatório" })
      .email({ message: "Email inválido" }),
    cellphone: z
      .string({ required_error: "O celular é obrigatório" })
  })

  const userInfoForm = useForm<z.infer<typeof userInfoSchema>>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      name,
      linkstoBe,
      email,
      cellphone
    }
  })

  const onSubmit = async (values: z.infer<typeof userInfoSchema>) => {
    try {
      const {
        name,
        linkstoBe,
        email,
        cellphone
      } = values

      const userCanEdit = canEdit()
      if (!userCanEdit) {
        toast({
          variant: "destructive",
          title: "Erro ao editar dados",
          description: "Você não possui permissão para editar os dados de um usuário/projeto. Entre em contato com o administrador.",
        })
        return
      }

      const users = await UserService.getAllUsers()
      const [emailInUse] = users.filter(({ email: userEmail }) => userEmail === email)

      if (emailInUse && String(emailInUse.id) != userId) {
        toast({
          variant: "destructive",
          title: "Erro ao atualizar as informações",
          description: "Esse email já está sendo usado por outro usuário.",
        })
        return
      }

      const linkstoBeInUse = await ProjectService.getProjectById(linkstoBe)

      if (
        (linkstoBeInUse && String(linkstoBeInUse.user_id) != userId) || 
        (linkstoBeInUse && String(linkstoBeInUse.id) != projectId)
      ) {
        toast({
          variant: "destructive",
          title: "Erro ao atualizar as informações",
          description: "Esse link já está em uso em outro projeto.",
        })
        return
      }

      await UserService.updateUserById(userId, {
        cellphone,
        email,
        name
      })

      await ProjectService.updateProjectById(projectId, {
        linkstoBe,
      })

      toast({
        variant: "success",
        title: "Troca concluída!",
        description: "O plano foi trocado com sucesso.",
      })
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "Erro ao atualizar as informações",
        description: "Ocorreu um erro ao atualizar as informações. Tente novamente.",
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
            title="Alterar dados do usuário"
          />
        </Modal.Header>
        <Modal.Content>
          <Form {...userInfoForm}>
            <form
              onSubmit={userInfoForm.handleSubmit(onSubmit)}
            >
              <div
                className="flex flex-col gap-4 pb-6"
              >
                <div
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <FormField
                      control={userInfoForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do usuário</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Digite o nome do usuário"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={userInfoForm.control}
                      name="linkstoBe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link do usuário</FormLabel>
                          <FormControl>
                            <div
                              className="gap-0 items-center flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50 focus-within:ring-1"
                            >
                              <span
                                className="text-[#525151] text-base"
                              >
                                linksto.be/
                              </span>
                              <Input 
                                placeholder="Digite o nome do usuário"
                                className="border-none outline-none focus-visible:ring-0 pl-1"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <FormField
                      control={userInfoForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email do usuário</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Digite o email do usuário"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={userInfoForm.control}
                      name="cellphone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone do usuário</FormLabel>
                          <FormControl>
                            <PhoneInput
                              country={'br'}
                              value={field.value}
                              onChange={(phone) => field.onChange(phone)}
                              inputProps={{
                                placeholder: 'Digite o telefone do usuário',
                                name: field.name,
                              }}
                              containerStyle={{ width: '100%' }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                </div>
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