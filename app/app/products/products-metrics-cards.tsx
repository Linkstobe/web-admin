'use client'
import { AnalyticsSimpleCard } from "@/components/analytics-simple-card";
import { IMetric } from "@/interfaces/IMetrics";
import { ITransaction } from "@/interfaces/ITransactions";
import { MetricsServices } from "@/services/metrics.service";
import { TransactionService } from "@/services/transactions.service";
import { DollarSign, MousePointerClick, User } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductsMetricsCardsProps {
  transactions: ITransaction[]
  productAccessMetrics: IMetric[]
  productClicksMetrics: IMetric[]
}

type ProductMetrics = {
  totalAccesses: number
  totalClicks: number
  newSales: number
  invoicing: number
}

export default function ProductsMetricsCards ({
  productAccessMetrics,
  productClicksMetrics,
  transactions
}: ProductsMetricsCardsProps) {
  const [productsMetrics, setProductsMetrics] = useState<ProductMetrics>({
    totalAccesses: 0,
    totalClicks: 0,
    newSales: 0,
    invoicing: 0,
  })
  
  useEffect(() => {
    const getAllProductsMetrics = async () => {

      const productTransactions = transactions.filter(({ productId }) => productId && !isNaN(productId))

      const totalClicks = productClicksMetrics.length
      const totalAccesses = productAccessMetrics.length
      const newSales = productTransactions.length
      let invoicing = 0

      productTransactions.forEach(({ amount }) => {
        const value = Number(amount) / 100
        invoicing += value
      })
      
      setProductsMetrics(prev => ({
        ...prev,
        totalClicks,
        totalAccesses,
        invoicing,
        newSales
      }))
    }

    getAllProductsMetrics()
  }, [productAccessMetrics, productClicksMetrics, transactions])

  return (
    <div
      className="grid grid-cols-4 gap-4 bg-white rounded-lg shadow-lg p-4"
    >
      <AnalyticsSimpleCard.Root>
        <AnalyticsSimpleCard.Content>
          <AnalyticsSimpleCard.TopSection>
            <AnalyticsSimpleCard.Title 
              title="Total de acessos"
            />

            <AnalyticsSimpleCard.Icon
              icon={User}
            />
          </AnalyticsSimpleCard.TopSection>
          <AnalyticsSimpleCard.BodySection>
            <AnalyticsSimpleCard.Value 
              value={productsMetrics.totalAccesses}
            />
          </AnalyticsSimpleCard.BodySection>
        </AnalyticsSimpleCard.Content>
      </AnalyticsSimpleCard.Root>

      <AnalyticsSimpleCard.Root>
        <AnalyticsSimpleCard.Content>
          <AnalyticsSimpleCard.TopSection>
            <AnalyticsSimpleCard.Title 
              title="Total de cliques"
            />

            <AnalyticsSimpleCard.Icon
              icon={MousePointerClick}
            />
          </AnalyticsSimpleCard.TopSection>
          <AnalyticsSimpleCard.BodySection>
            <AnalyticsSimpleCard.Value
              value={productsMetrics.totalClicks}
            />
          </AnalyticsSimpleCard.BodySection>
        </AnalyticsSimpleCard.Content>
      </AnalyticsSimpleCard.Root>

      <AnalyticsSimpleCard.Root>
        <AnalyticsSimpleCard.Content>
          <AnalyticsSimpleCard.TopSection>
            <AnalyticsSimpleCard.Title 
              title="Novas vendas"
            />

            <AnalyticsSimpleCard.Icon
              icon={DollarSign}
            />
          </AnalyticsSimpleCard.TopSection>
          <AnalyticsSimpleCard.BodySection>
            <AnalyticsSimpleCard.Value 
              value={productsMetrics.newSales}
            />
          </AnalyticsSimpleCard.BodySection>
        </AnalyticsSimpleCard.Content>
      </AnalyticsSimpleCard.Root>

      <AnalyticsSimpleCard.Root>
        <AnalyticsSimpleCard.Content>
          <AnalyticsSimpleCard.TopSection>
            <AnalyticsSimpleCard.Title 
              title="Faturamento total"
            />

            <AnalyticsSimpleCard.Icon
              icon={DollarSign}
            />
          </AnalyticsSimpleCard.TopSection>
          <AnalyticsSimpleCard.BodySection>
            <AnalyticsSimpleCard.Value 
              value={productsMetrics.invoicing}
              type="monetary"
            />
          </AnalyticsSimpleCard.BodySection>
        </AnalyticsSimpleCard.Content>
      </AnalyticsSimpleCard.Root>
    </div>
  )
}