'use client'

import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"

import useAuth from "@/hook/use-auth"
import { useRouter } from "next/navigation"

export default function Authentication() {
  const loginFormSchema = z.object({
    email: z
      .string({ required_error: "O email é obrigátorio" })
      .email({ message: "Email inválido" }),
    password: z
      .string({ required_error: "A senha é obrigatória" })
      .min(8, "A senha deve ter no mínimo 8 caracteres")
  })

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onAuth = useAuth()
  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {    
    try {
      // @ts-ignore
      await onAuth(values)
      router.push("/app")
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>Insira seu email e senha para acessar sua conta</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="email@example.com"
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
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Senha
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
