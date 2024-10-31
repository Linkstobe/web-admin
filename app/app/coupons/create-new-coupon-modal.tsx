'use client'

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InputMask from "react-input-mask";

import { CalendarIcon, Plus } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ICoupon } from "@/interfaces/ICoupons";
import { CouponService } from "@/services/coupons.service";
import { useToast } from "@/hooks/use-toast";
import { usePermission } from "@/hook/use-permission";


export default function CreateNewCouponModal () {
  const { toast } = useToast()
  const { canEdit } = usePermission()

  const [discountType, setDiscountType] = useState<string>("Porcentagem");
  const [expirationType, setExpirationType] = useState<string>("Pela data")

  const createCouponSchema = z.object({
    couponName: z
      .string({
        required_error: "Nome do cupom é obrigatório",
      })
      .min(3, { 
        message: "O nome deve ter no mínimo 3 caracteres" 
      }),
    couponExpirationType: z
      .string({ required_error: "O tipo de expiração é obrigatório" }),
    couponExpirationDate: z
      .date({
        required_error: "A data de expiração é obrigatória",
      })
      .optional(),
    couponRedemptionLimit: z
      .string()
      .optional(),
    couponLimitation: z
      .string({
        required_error: "Limitação do cupom é obrigatória",
      })
      .optional(),
    couponDiscountType: z
      .string({ 
        required_error: "O tipo de desconto é obrigatório",
      }),
    couponDiscountPercent: z
      .string()
      .optional(),
    couponDiscountValue: z
      .string()
      .optional(),
    userAssociatedWithCoupon: z
      .string()
      .optional(),
  }).superRefine((data, ctx) => {
    if (data.couponDiscountType === "Porcentagem" && !data.couponDiscountPercent) {
      ctx.addIssue({
        code: "custom",
        path: ["couponDiscountPercent"],
        message: "A porcentagem de desconto é obrigatória",
      });
    }

    if (data.couponDiscountType === "Valor" && !data.couponDiscountValue) {
      ctx.addIssue({
        code: "custom",
        path: ["couponDiscountValue"],
        message: "O valor de desconto é obrigatório",
      });
    }

    if (data.couponExpirationType === "Pela data" && !data.couponExpirationDate) {
      ctx.addIssue({
        code: "custom",
        path: ["couponExpirationDate"],
        message: "A data de expiração é obrigatória",
      });
    }

    if (data.couponExpirationType === "Por uso" && !data.couponRedemptionLimit) {
      ctx.addIssue({
        code: "custom",
        path: ["couponRedemptionLimit"],
        message: "O limite de uso é obrigatório",
      });
    }
  });


  const createCouponForm = useForm<z.infer<typeof createCouponSchema>>({
    resolver: zodResolver(createCouponSchema),
    defaultValues: {
      couponName: "",
      couponDiscountPercent: "",
      couponDiscountType: "Porcentagem",
      couponDiscountValue: "",
      couponExpirationDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      couponLimitation: "Sem limitaçãoes",
      couponExpirationType: "Pela data",
      userAssociatedWithCoupon: "",
    }
  })

  const onSubmit = async (values: z.infer<typeof createCouponSchema>) => {
    const {
      couponName,
      couponExpirationDate,
      couponLimitation,
      couponDiscountPercent,
      userAssociatedWithCoupon,
      couponDiscountType,
      couponDiscountValue,
      couponExpirationType,
      couponRedemptionLimit
    } = values

    try {
      const userCanEdit = canEdit()
      if (!userCanEdit) {
        toast({
          variant: "destructive",
          title: "Erro ao criar cupom",
          description: "Você não possui permissão para criar um cupom. Entre em contato com o administrador.",
        })
        return
      }

      const data: ICoupon = {
        duration: "once",
        coupon_name: couponName,
      }

      const discountIsPercentage = couponDiscountType === "Porcentagem"
      if (discountIsPercentage) {
        data.percent_off = Number(couponDiscountPercent?.replace("%", ""))
      } else {
        data.amount_off = Number(couponDiscountValue?.replace(",", ".")) * 100;
        data.currency = "brl";
      }

      const expirationIsByDate = couponExpirationType === "Pela data"
      if (expirationIsByDate) {
        const couponExpirationDateUnix = Date.parse(String(couponExpirationDate)) / 1000
        data.redeem_by = couponExpirationDateUnix
      } else {
        data.max_redemptions = Number(couponRedemptionLimit)
      }
      
      await CouponService.createNewCoupon(data)

      toast({
        variant: "success",
        title: "Cupom criado!",
        description: "O cupom foi criado com sucesso.",
      })
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Erro ao criar cupom",
        description: "Ocorreu um erro ao criar o cupom. Tente novamente.",
      })
    }
  } 
  
  return (
    <Modal.Root>
      <Modal.OpenButton>
        <Button
          className="gap-2 text-sm font-medium p-3 bg-[#299FC7] text-white"
        >
          <Plus />
          Cadastrar novo cupom
        </Button>
      </Modal.OpenButton>
      <Modal.Container>
        <Modal.Header>
          <Modal.Title 
            title="Cadastrar cupom"
          />
        </Modal.Header>
        <Modal.Content>
          {/* Formulario */}
          <Form {...createCouponForm}>
            <form
              onSubmit={createCouponForm.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div
                className="grid grid-cols-1 gap-4"
              >
                <div>
                  <FormField
                    control={createCouponForm.control}
                    name="couponName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do cupom</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o nome do cupom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* <div
                  className="self-end"
                >
                  <FormField
                    control={createCouponForm.control}
                    name="couponExpirationDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col z-[1050]">
                        <FormLabel>Data de expiração</FormLabel>
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>dd/mm/aaaa</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-[1050]" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              locale={ptBR}
                            />
                          </PopoverContent>

                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div> */}
              </div>

              <div
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <FormField 
                    control={createCouponForm.control}
                    name="couponExpirationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de expiração</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value)
                            setExpirationType(value)
                            createCouponForm.setValue("couponExpirationDate", new Date());
                            createCouponForm.setValue("couponRedemptionLimit", "");
                          }} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de expiração do cupom" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Pela data">Pela data</SelectItem>
                            <SelectItem value="Por uso">Por uso</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div
                  className="self-end"
                >
                  {
                    expirationType === "Pela data" 
                    ? (
                        <FormField
                          control={createCouponForm.control}
                          name="couponExpirationDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col z-[1050]">
                              <FormLabel>Data de expiração</FormLabel>
                              <Popover modal={true}>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>dd/mm/aaaa</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 z-[1050]" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                    locale={ptBR}
                                  />
                                </PopoverContent>

                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    ) : (
                        <FormField
                          control={createCouponForm.control}
                          name="couponRedemptionLimit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Limite de usos</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Digite o limite de usos do cupom" 
                                  type="number"
                                  min={0}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    )
                  }
                </div>
              </div>

              <div
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <FormField 
                    control={createCouponForm.control}
                    name="couponDiscountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo do desconto</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value)
                            setDiscountType(value)
                            createCouponForm.setValue("couponDiscountPercent", "");
                            createCouponForm.setValue("couponDiscountValue", "");
                          }} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de desconto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Porcentagem">Porcentagem</SelectItem>
                            <SelectItem value="Valor">Valor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {
                  discountType === "Porcentagem"
                  ? (
                    <div>
                      <FormField
                        control={createCouponForm.control}
                        name="couponDiscountPercent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Porcentagem de desconto</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a porcentagem do desconto" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="10%">10%</SelectItem>
                                <SelectItem value="20%">20%</SelectItem>
                                <SelectItem value="30%">30%</SelectItem>
                                <SelectItem value="40%">40%</SelectItem>
                                <SelectItem value="50%">50%</SelectItem>
                                <SelectItem value="60%">60%</SelectItem>
                                <SelectItem value="70%">70%</SelectItem>
                                <SelectItem value="80%">80%</SelectItem>
                                <SelectItem value="90%">90%</SelectItem>
                                <SelectItem value="100%">100%</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ) : (
                    <div>
                      {/* <FormField
                        control={createCouponForm.control}
                        name="couponDiscountValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor de desconto</FormLabel>
                            <FormControl>
                              <Input placeholder="Digite o valor de desconto" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}
                      
                      <FormField
                        control={createCouponForm.control}
                        name="couponDiscountValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor de desconto</FormLabel>
                            <FormControl>
                              <InputMask
                                mask="R$ 99,99"
                                value={field.value}
                                onChange={(e) => {
                                  const cleanValue = e.target.value.replace("R$ ", "");
                                  field.onChange(cleanValue);
                                }}
                              >
                                {(inputProps) => (
                                  <Input placeholder="R$ 0,00" {...inputProps} />
                                )}
                              </InputMask>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    </div>
                  )
                }

              </div>

              <div
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <FormField
                    control={createCouponForm.control}
                    name="couponLimitation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Limitações</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um tipo de limitação para o cupom" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Sem limitaçãoes">Sem limitaçãoes</SelectItem>
                            <SelectItem value="Primeira compra">Primeira compra</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={createCouponForm.control}
                    name="userAssociatedWithCoupon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Associar cupom ao usuário</FormLabel>
                        <FormControl>
                          <Input placeholder="Associe o cupom a um usuário" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Modal.Footer>
                <Button
                  type="submit"
                  className="text-white font-medium text-base py-3 px-11 bg-[#164F62] mt-1"
                >
                  Cadastrar
                </Button>
              </Modal.Footer>
            </form>
          </Form>
        </Modal.Content>
      </Modal.Container>
    </Modal.Root>
  )
}