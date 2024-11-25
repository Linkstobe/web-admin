'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CancellationReasonModal from "./cancellation-reason-modal";
import { useEffect, useState } from "react";
import { ICancellationReason } from "@/interfaces/ICancellationReasons";

export default function PlanCancellationReason () {
  const [allCancellationReasons, setAllCancellationReasons] = useState<ICancellationReason []>([])

  useEffect(() => {
    const getCancellationReasons = async () => {
      try {
        
      } catch (error) {
        console.log("PlanCancellationReason: ", error)
      }
    }

    getCancellationReasons()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Cancelamentos
        </CardTitle>
        <CardDescription>
          Clique em um usuário para ver o motivo do seu cancelamento
        </CardDescription>
      </CardHeader>

      <CardContent
        className="p-0 h-full"
      >
        {
          allCancellationReasons.length > 0
          ? (
            <ul
              className="flex flex-col gap-1 px-4"
            >
              <CancellationReasonModal>
                <li
                  className="text-sm text-start px-2 rounded-lg transition-all duration-700 font-medium cursor-pointer hover:bg-[#D2D2D2]"
                >
                  <span className="block py-2">Luiz Antônio cancelou o <span className="text-[#164F62] font-bold">Plano Pro</span></span>
                  <div className="w-[90%] border border-[#D9D9D9] m-auto rounded-md"></div>
                </li>
              </CancellationReasonModal>              
              <CancellationReasonModal>
                <li
                  className="text-sm px-2 text-start rounded-lg transition-all duration-700 font-medium cursor-pointer hover:bg-[#D2D2D2]"
                >
                  <span className="block py-2">Ana Beatriz Giovanni cancelou o <span className="text-[#299FC7] font-bold">Plano Premium</span></span>
                  <div className="w-[90%] border border-[#D9D9D9] m-auto rounded-md"></div>
                </li>
              </CancellationReasonModal>
              <CancellationReasonModal>
                <li
                  className="text-sm px-2 text-start rounded-lg transition-all duration-700 font-medium cursor-pointer hover:bg-[#D2D2D2]"
                >
                  <span className="block py-2">Gisele Tiffole cancelou o <span className="text-[#299FC7] font-bold">Plano Premium</span></span>
                  <div className="w-[90%] border border-[#D9D9D9] m-auto rounded-md"></div>
                </li>
              </CancellationReasonModal>
            </ul>
          )
          : (
            <div
              className="h-full flex items-center justify-center"
            >
              <p
                className="text-center -mt-24 text-neutral-700"
              >
                Não houveram cancelamentos
              </p>
            </div>
          )
        }
      </CardContent>
    </Card>
  )
}