"use client"

import { Table } from "@/components/table"
import { usePermission } from "@/hook/use-permission"
import { useToast } from "@/hooks/use-toast"
import { CouponService } from "@/services/coupons.service"
import { Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

export function CouponsTable () {
  const { toast } = useToast()
  const { canEdit } = usePermission()

  const [allCoupons, setAllCoupons] = useState([])
  const [filteredCoupons, setFilteredCoupons] = useState([])

  const onFilterCoupon = (value: string) => {
    if (value.trim() === "") {
      setFilteredCoupons(allCoupons)
      return
    }

    const filteredCoupons = allCoupons.filter(item =>
      Object.values(item).some(
        field => typeof field === 'string' && field.toLowerCase().includes(value.trim().toLowerCase())
      )
    )

    setFilteredCoupons(filteredCoupons)
  }

  const disableCoupon = async (promotionId: string) => {
    try {
      const userCanEdit = canEdit()
      if (!userCanEdit) {
        toast({
          variant: "destructive",
          title: "Erro ao excluir cupom",
          description: "Você não possui permissão para excluir um cupom. Entre em contato com o administrador.",
        })
        return
      }

      await CouponService.disableCouponByPromotionId(promotionId)
      await getAllCoupons()
    } catch (error) {
      console.log(error)
    }
  
  }
  const getAllCoupons = async () => {
    const coupons = await CouponService.getAllCoupons()

    console.log({ coupons })

    const couponsTableInfos = coupons.filter(({ active }: { active: boolean }) => active).map(({ id, code, coupon }) => {
      const {
        amount_off,
        percent_off,
        max_redemptions,
        redeem_by
      } = coupon

      return {
        code,
        associatedWith: "Linkstobe",
        discount: amount_off ? "R$ " + (amount_off / 100).toFixed(2).replace(".", ",") : percent_off + "%",
        expirationDate: max_redemptions ? max_redemptions + " usos" : new Date(redeem_by * 1000).toLocaleDateString('pt-BR'),
        limitations: "Sem limitações",
        promotionId: id,
      }
    })
    
    setAllCoupons(couponsTableInfos)
    setFilteredCoupons(couponsTableInfos)    
  }

  useEffect(() => {
    getAllCoupons()
  }, [])

  return (
    <Table.Root>
      <Table.TopSection>
        <Table.Title 
          title="Cupons ativos"
        />

        <Table.Search
          onChange={onFilterCoupon}
          placeholder="Buscar"
        />

        <Table.TopButton
          icon={Trash2}
          className="text-white"
        />
      </Table.TopSection>

      <Table.Content>
        <Table.HeaderSection>
          <Table.Row>
            <Table.HeaderItem
              title="Cupom"
            />
            <Table.HeaderItem
              title="Associado à"
            />
            <Table.HeaderItem
              title="Expiração"
            />
            <Table.HeaderItem
              title="Desconto"
            />
            <Table.HeaderItem
              title="Limitações"
            />
            <Table.HeaderItem
              title=""
            />
          </Table.Row>
        </Table.HeaderSection>

        <Table.BodySection>
          {
            filteredCoupons.map(({ code, associatedWith, discount, expirationDate, limitations, promotionId }, index) => (
              <Table.Row
                key={index}
              >
                <Table.BodyItem 
                  text={code}
                />
                <Table.BodyItem 
                  text={associatedWith}
                />
                <Table.BodyItem 
                  text={expirationDate}
                />
                <Table.BodyItem 
                  text={discount}
                />
                <Table.BodyItem 
                  text={limitations}
                />
                <Table.BodyItem>
                  <Table.BasicAction 
                    tooltipText="Excluir cupom"
                    icon={Trash2}
                    className="text-[#565656]"
                    onClick={async () => disableCoupon(promotionId)}
                  />
                </Table.BodyItem>
              </Table.Row>
            ))
          }
        </Table.BodySection>

      </Table.Content>
    </Table.Root>
  )
}