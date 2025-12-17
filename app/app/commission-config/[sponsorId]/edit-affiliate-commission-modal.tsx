"use client";

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  IAffiliate,
  IAffiliateConfig,
} from "@/interfaces/IAffiliateSubCommissionConfig";
import { AffiliateSubCommissionConfigService } from "@/services/affiliate-sub-commission-config.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { ReactNode, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface EditAffiliateCommissionModalProps {
  children: ReactNode;
  affiliate: IAffiliate;
  sponsorId: number;
  existingConfig: IAffiliateConfig | null;
  onSuccess: () => void;
}

const commissionSchema = z.object({
  sub_percent_influencer: z
    .string()
    .min(1, "Percentual do sponsor é obrigatório")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 100;
      },
      {
        message: "Informe um número válido entre 0 e 100",
      }
    ),
  sub_percent_platform: z
    .string()
    .min(1, "Percentual da plataforma é obrigatório")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 100;
      },
      {
        message: "Informe um número válido entre 0 e 100",
      }
    ),
});

type CommissionFormValues = z.infer<typeof commissionSchema>;

export default function EditAffiliateCommissionModal({
  children,
  affiliate,
  sponsorId,
  existingConfig,
  onSuccess,
}: EditAffiliateCommissionModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const form = useForm<CommissionFormValues>({
    resolver: zodResolver(commissionSchema),
    defaultValues: {
      sub_percent_influencer: "",
      sub_percent_platform: "",
    },
  });

  const onSubmit = async (values: CommissionFormValues) => {
    try {
      setIsSubmitting(true);

      const sub_percent_influencer = parseFloat(values.sub_percent_influencer);
      const sub_percent_platform = parseFloat(values.sub_percent_platform);

      if (existingConfig) {
        await AffiliateSubCommissionConfigService.updateConfig(
          existingConfig.id,
          {
            sub_percent_influencer,
            sub_percent_platform,
          }
        );
      } else {
        await AffiliateSubCommissionConfigService.createConfig({
          user_id: affiliate.id,
          sub_percent_influencer,
          sub_percent_platform,
        });
      }

      toast({
        variant: "success",
        title: "Configuração salva!",
        description:
          "Os percentuais de subcomissão foram atualizados com sucesso.",
      });

      // Fechar o modal
      closeButtonRef.current?.click();

      onSuccess();
    } catch (error: unknown) {
      console.error("EditAffiliateCommissionModal:", error);

      // Extrair mensagem de erro do backend
      let errorMessage =
        "Ocorreu um erro ao salvar os percentuais. Tente novamente.";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }

      toast({
        variant: "destructive",
        title: "Erro ao salvar configuração",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal.Root>
      <Modal.OpenButton>{children}</Modal.OpenButton>
      <Modal.Container>
        <Modal.CloseButton>
          <button ref={closeButtonRef} className="hidden" />
        </Modal.CloseButton>
        <Modal.Header>
          <Modal.Title title={`Configurar subcomissão - ${affiliate.name}`} />
        </Modal.Header>
        <Modal.Content>
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">
                  Sobre os percentuais de subcomissão:
                </p>
                <p className="mb-2">
                  Esses percentuais são aplicados sobre a comissão que este
                  afiliado recebe quando faz uma venda.
                </p>
                <p className="text-blue-700">
                  <strong>Exemplo:</strong> Produto de R$100 com comissão de 10%
                  (R$10) para o afiliado.
                  <br />
                  Se <em>% Sponsor = 3%</em>, o sponsor recebe R$0,30 dessa
                  comissão.
                  <br />
                  Se <em>% Plataforma = 2%</em>, a Linksto.be recebe R$0,20.
                  <br />O afiliado fica com R$9,50 (R$10 - R$0,30 - R$0,20).
                </p>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4 pb-6">
                <FormField
                  control={form.control}
                  name="sub_percent_influencer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>% Sponsor (Quem indicou)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={
                            existingConfig?.sub_percent_influencer
                              ? `Atual: ${parseFloat(
                                  existingConfig.sub_percent_influencer.toString()
                                ).toString()}%`
                              : "Ex: 3.5"
                          }
                          className="bg-white"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Permite apenas números e ponto decimal
                            if (value === "" || /^\d*\.?\d*$/.test(value)) {
                              field.onChange(value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sub_percent_platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>% Plataforma (Linksto.be)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={
                            existingConfig?.sub_percent_platform
                              ? `Atual: ${parseFloat(
                                  existingConfig.sub_percent_platform.toString()
                                ).toString()}%`
                              : "Ex: 2.0"
                          }
                          className="bg-white"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Permite apenas números e ponto decimal
                            if (value === "" || /^\d*\.?\d*$/.test(value)) {
                              field.onChange(value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Modal.Footer>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-white font-medium text-base py-3 px-11 bg-[#164F62] mt-1"
                >
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </Modal.Footer>
            </form>
          </Form>
        </Modal.Content>
      </Modal.Container>
    </Modal.Root>
  );
}
