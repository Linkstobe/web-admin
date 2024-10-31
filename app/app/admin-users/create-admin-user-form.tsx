'use client'

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { UserService } from "@/services/user.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function CreateAdminUserForm () {
  const { toast } = useToast()

  const [creationType, setCreationType] = useState<string>("Criar novo usuário")
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const [usersToSelect, setUsersToSelect] = useState([])

  const createAdminUserSchema = z
  .object({
    userCreationType: z.string({
      required_error: "Escolha criar um novo usuário ou escolher um existente",
    })
    .optional(),
    name: z
      .string({
        required_error: "O nome é obrigatório",
      })
      .min(3, "O nome deve ter no mínimo 3 caracteres")
      .optional(),
    email: z
      .string({
        required_error: "O email é obrigatório",
      })
      .email("Email inválido")
      .optional(),
    password: z
      .string({
        required_error: "A senha é obrigatória",
      })
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .optional(),
    permissions: z
      .string({
        required_error: "Escolher uma permissão é obrigatório",
      })
      .optional(),
    selectedUser: z
      .string({
        required_error: "Escolha o usuário para transformar em administrador",
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (creationType === "Criar novo usuário") {
      if (!data.name) {
        ctx.addIssue({
          code: "custom",
          path: ["name"],
          message: "O nome é obrigatório para criar um novo usuário",
        });
      }
      if (!data.email) {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: "O email é obrigatório para criar um novo usuário",
        });
      }
      if (!data.password) {
        ctx.addIssue({
          code: "custom",
          path: ["password"],
          message: "A senha é obrigatória para criar um novo usuário",
        });
      }
    } else {
      if (!data.selectedUser) {
        ctx.addIssue({
          code: "custom",
          path: ["selectedUser"],
          message: "Escolha o usuário para transformar em administrador",
        });
      }
    }
    // if (creationType === "Usuário já existente") {
    //   if (!data.selectedUser) {
    //     ctx.addIssue({
    //       code: "custom",
    //       path: ["selectedUser"],
    //       message: "Escolha o usuário para transformar em administrador",
    //     });
    //   }
    // } else {
    //   if (!data.name) {
    //     ctx.addIssue({
    //       code: "custom",
    //       path: ["name"],
    //       message: "O nome é obrigatório para criar um novo usuário",
    //     });
    //   }
    //   if (!data.email) {
    //     ctx.addIssue({
    //       code: "custom",
    //       path: ["email"],
    //       message: "O email é obrigatório para criar um novo usuário",
    //     });
    //   }
    //   if (!data.password) {
    //     ctx.addIssue({
    //       code: "custom",
    //       path: ["password"],
    //       message: "A senha é obrigatória para criar um novo usuário",
    //     });
    //   }
    // }
  });


  // const createAdminUserSchema = z
  //   .object({
  //     userCreationType: z
  //       .string({
  //         required_error: "Escolha criar um novo usuário ou escolher um existente",
  //       })
  //       .optional(),
  //     name: z
  //       .string()
  //       .min(3, "O nome deve ter no mínimo 3 caracteres")
  //       .nullable(), // Set nullable
  //     email: z
  //       .string()
  //       .email("Email inválido")
  //       .nullable(), // Set nullable
  //     password: z
  //       .string()
  //       .min(8, "A senha deve ter no mínimo 8 caracteres")
  //       .nullable(), // Set nullable
  //     permissions: z
  //       .string({
  //         required_error: "Escolher uma permissão é obrigatório",
  //       })
  //       .optional(),
  //     selectedUser: z
  //       .string({
  //         required_error: "Escolha o usuário para transformar em administrador",
  //       })
  //       .nullable(), // Set nullable
  //   })
  //   .superRefine((data, ctx) => {
  //     if (data.userCreationType === "Usuário já existente") {
  //       // Check if selectedUser is provided when using an existing user
  //       if (!data.selectedUser) {
  //         ctx.addIssue({
  //           code: "custom",
  //           path: ["selectedUser"],
  //           message: "Escolha o usuário para transformar em administrador",
  //         });
  //       }
  //     } else {
  //       // Check if name, email, and password are provided when creating a new user
  //       if (!data.name) {
  //         ctx.addIssue({
  //           code: "custom",
  //           path: ["name"],
  //           message: "O nome é obrigatório para criar um novo usuário",
  //         });
  //       }
  //       if (!data.email) {
  //         ctx.addIssue({
  //           code: "custom",
  //           path: ["email"],
  //           message: "O email é obrigatório para criar um novo usuário",
  //         });
  //       }
  //       if (!data.password) {
  //         ctx.addIssue({
  //           code: "custom",
  //           path: ["password"],
  //           message: "A senha é obrigatória para criar um novo usuário",
  //         });
  //       }
  //     }
  //   });

  const createAdminUserForm = useForm<z.infer<typeof createAdminUserSchema>>({
    resolver: zodResolver(createAdminUserSchema),
    defaultValues: {
      userCreationType: "Criar novo usuário",
      name: "",
      email: "",
      password: "",
      permissions: "Somente ver",
      selectedUser: "",
    }
  })

  // const onSubmit = async (values: z.infer<typeof createAdminUserSchema>) => {
  //   try {
  //     const {
  //       name,
  //       email,
  //       password,
  //       permissions,
  //       userCreationType,
  //       selectedUser
  //     } = values
  
  //     console.log({ values });
  //     return
      

  //     const existingUser = userCreationType === "Usuário já existente"
  //     if (existingUser) {
  //       const userToUpdate = await UserService.getUserById(selectedUser)
  //       console.log({ userToUpdate });
  //       return
  //       await UserService.updateUserById(selectedUser, {
  //         permission: permissions,
  //       })
  //     } else {
  //       await UserService.createNewUser({
  //         name,
  //         email,
  //         password,
  //         cellphone: "00",
  //         permission: permissions,
  //         profile_photo: "https://srv538807.hstgr.cloud/uploads/file-1729101715653-720592456.webp"
  //       })
  //     }

  //     toast({
  //       variant: "success",
  //       title: "Administardor criado!",
  //       description: "O administrador foi criado com sucesso.",
  //     })

  //   } catch (error) {
  //     console.log(error)
  //     toast({
  //       variant: "destructive",
  //       title: "Erro ao criar administrador",
  //       description: "Ocorreu um erro ao criar o administrador. Tente novamente.",
  //     })
  //   }

  // }

  const onSubmit = async (values: z.infer<typeof createAdminUserSchema>) => {
    try {
      const { name, email, password, permissions, userCreationType, selectedUser } = values;
      const existingUser = userCreationType === "Usuário já existente";

      console.log("Submitting values:", values)

      if (existingUser) {
        console.log("Updating existing user...");
        await UserService.updateUserById(selectedUser, {
          permission: permissions !== "Somente ver" ? "editar" : "ver",
        });
      } else {
        console.log("Creating new user...");
        await UserService.createNewUser({
          name,
          email,
          password,
          cellphone: "00",
          permission: permissions !== "Somente ver" ? "editar" : "ver",
          profile_photo: "https://srv538807.hstgr.cloud/uploads/file-1729101715653-720592456.webp",
        });
      }

      toast({
        variant: "success",
        title: "Administrador criado!",
        description: "O administrador foi criado com sucesso.",
      });

    } catch (error) {
      console.error("Error creating admin:", error)
      toast({
        variant: "destructive",
        title: "Erro ao criar administrador",
        description: "Ocorreu um erro ao criar o administrador. Tente novamente.",
      })
    }
  }


  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const users = await UserService.getAllUsers()
        setUsersToSelect(users)
        console.log({ users });
      } catch (error) {
        console.log(error)
      } 
    }

    getAllUsers()
  }, [])

  return (
    <div
      className="max-w-[350px]"
    >
      <Form {...createAdminUserForm}>
        <form
          onSubmit={createAdminUserForm.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <div>
            <FormField 
              control={createAdminUserForm.control}
              name="userCreationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Selecione o tipo de criação do admin
                  </FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={(value) => {
                      field.onChange(value)
                      setCreationType(value)

                      if (field.value === "Usuário já existente") {
                        createAdminUserForm.setValue("email", "email@email.com")
                        createAdminUserForm.setValue("name", "name")
                        createAdminUserForm.setValue("password", "12345678")
                      } else {
                        createAdminUserForm.setValue("email", "")
                        createAdminUserForm.setValue("name", "")
                        createAdminUserForm.setValue("password", "")
                      }
                    }}
                  >
                    <FormControl className="bg-white">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de criação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Usuário já existente">Usuário já existente</SelectItem>
                      <SelectItem value="Criar novo usuário">Criar novo usuário</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          {
            creationType === "Usuário já existente" 
            ? (
              <>
                <div>
                  <FormField
                    control={createAdminUserForm.control}
                    name="selectedUser"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Email do usuário</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? usersToSelect.find((user) => String(user.id) === String(field.value))?.email
                                  : "Select user email"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <Command>
                              <CommandInput placeholder="Search user email..." />
                              <CommandList>
                                <CommandEmpty>No user found.</CommandEmpty>
                                <CommandGroup>
                                  {usersToSelect.map(({ id, email }) => (
                                    <CommandItem
                                      value={email}
                                      key={id}
                                      onSelect={() => {
                                        field.onChange(String(id));

                                        createAdminUserForm.setValue("email", "email@email.com")
                                        createAdminUserForm.setValue("name", "name")
                                        createAdminUserForm.setValue("password", "12345678")
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          String(id )=== String(field.value) ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {email}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Aqui você pode selecionar um usuário já existente para dar permissões de administrador
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <FormField
                    control={createAdminUserForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do usuário</FormLabel>
                        <FormControl className="bg-white">
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
                    control={createAdminUserForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email do usuário</FormLabel>
                        <FormControl className="bg-white">
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
                    control={createAdminUserForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl className="bg-white">
                          <Input
                            type="password"
                            placeholder="Digite a senha de acesso"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )
          }

          <div>
            <FormField 
              control={createAdminUserForm.control}
              name="permissions"
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
                      <SelectItem value="Somente ver">Somente ver</SelectItem>
                      <SelectItem value="editar">Ver e editar</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div
            className="flex justify-end"
          >
            <Button
              type="submit"
              className="text-white font-medium text-base py-3 px-11 bg-[#164F62] mt-1"
            >
              Cadastrar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}