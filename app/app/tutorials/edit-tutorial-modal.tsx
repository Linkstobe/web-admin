'use client'
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePermission } from "@/hook/use-permission";
import { useToast } from "@/hooks/use-toast";
import { TutorialExamplesService } from "@/services/turorial-examples.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { HTMLAttributes, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface EditTutorialModalProps extends HTMLAttributes<HTMLDivElement> {
  tutorialId: number
  tutorialTitle: string
  tutorialDescription: string
  tutorialVideoUrl: string
  updateFunction: () => void
}

export default function EditTutorialModal ({
  children,
  tutorialId,
  tutorialTitle,
  tutorialDescription,
  tutorialVideoUrl,
  updateFunction
}: EditTutorialModalProps) {
  const { toast } = useToast()
  const { canEdit } = usePermission()

  const createTutorialSchema = z.object({
    title: z.string({ required_error: 'O título é obrigatório' }),
    description: z.string({ required_error: 'A descrição é obrigatória' }),
    videoUrl: z
      .string({ required_error: 'O link do vídeo é obrigatório' })
      .url({ message: "O link deve ser uma url válida" }),
  })

  const createTutorialForm = useForm<z.infer<typeof createTutorialSchema>>({
    resolver: zodResolver(createTutorialSchema),
    defaultValues: {
      description: tutorialDescription,
      title: tutorialTitle,
      videoUrl: tutorialVideoUrl
    }
  })

  const onSubmit = async (values: z.infer<typeof createTutorialSchema>) => {
    try {
      const {
        description,
        title,
        videoUrl
      } = values

      const userCanEdit = canEdit()
      if (!userCanEdit) {
        toast({
          variant: "destructive",
          title: "Erro ao atualizar tutorial",
          description: "Você não possui permissão para atualizar um tutorial. Entre em contato com o administrador.",
        })
        return
      }

      await TutorialExamplesService.updateTutorialExampleById(tutorialId, {
        tutorial_description: description,
        tutorial_link_midia: videoUrl,
        tutorial_title: title
      })

      toast({
        variant: "success",
        title: "Tutorial atualizado!",
        description: "O tutorial foi atualizado com sucesso.",
      });

      updateFunction()
    } catch (error) {
      console.log("EditTutorialModal - onSubmit: ", error)
    }
  }

  useEffect(() => {
    createTutorialForm.reset({
      description: tutorialDescription,
      title: tutorialTitle,
      videoUrl: tutorialVideoUrl
    })
  }, [tutorialId, tutorialTitle, tutorialDescription, tutorialVideoUrl])

  return (
   <Modal.Root>
    <Modal.OpenButton>
      {children}
    </Modal.OpenButton>
    <Modal.Container>
      <Modal.Header>
        <Modal.Title title="Painel de tutorial" />
      </Modal.Header>
      <Modal.Content>
        <Form
          {...createTutorialForm}
        >
          <form onSubmit={createTutorialForm.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4 pb-6">
              <FormField 
                control={createTutorialForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do tutorial</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o título do tutorial"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField 
                control={createTutorialForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do tutorial</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Digite a descrição do tutorial"
                        className="flex h-28 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField 
                control={createTutorialForm.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inserir vídeo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Cole aqui o link do vídeo de tutorial"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Modal.Footer>
              <div className="flex gap-4">
                <Button
                  variant="destructive"
                  className="text-white font-medium text-base py-3"
                >
                  Cancelar
                </Button>

                <Button
                  className="text-white font-medium text-base py-3 px-6 bg-[#164F62]"
                >
                  Salvar
                </Button>
              </div>
            </Modal.Footer>
          </form>
        </Form>
      </Modal.Content>
    </Modal.Container>
   </Modal.Root> 
  )
}