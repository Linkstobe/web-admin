"use client";

import { Modal } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IComplaint } from "@/interfaces/IComplaints";
import { IProject } from "@/interfaces/IProjects";
import { IUser } from "@/interfaces/IUser";
import { ComplaintService } from "@/services/complaint.service";
import { ProjectService } from "@/services/project.service";
import { UserService } from "@/services/user.service";
import { jwtDecode } from "jwt-decode";
import {
  BadgeInfo,
  Calendar,
  Crown,
  Mail,
  Phone,
  TriangleAlert,
  User,
} from "lucide-react";
import { HTMLAttributes, ReactNode, useEffect, useState } from "react";

interface DetailedComplaintModalProps extends HTMLAttributes<HTMLDataElement> {
  children: ReactNode;
  complaintId: number;
  projectId: number;
  userId: number;
}

type AccusedInfo = {
  name: string;
  email: string;
  cellphone?: string;
  createdAt: string;
  reportedLinkstobe: string;
  reportedLinkstobePlan: string;
};

type ComplainantInfo = {
  name: string;
  email: string;
};

type ComplaintDetails = {
  type: string;
  createdAt: string;
  comment: string;
};

type ComplaintItem = {
  accusedInfo: AccusedInfo;
  complainantInfo: ComplainantInfo;
  complaintDetails: ComplaintDetails;
};

export default function DetailedComplaintModal({
  children,
  complaintId,
  projectId,
  userId,
}: DetailedComplaintModalProps) {
  const [complaintItem, setComplaintInfo] = useState<ComplaintItem>({
    accusedInfo: {
      name: "",
      email: "",
      cellphone: "",
      createdAt: "",
      reportedLinkstobe: "",
      reportedLinkstobePlan: "",
    },
    complainantInfo: {
      email: "",
      name: "",
    },
    complaintDetails: {
      comment: "",
      createdAt: "",
      type: "",
    },
  });

  const roleStyle = {
    basic: "bg-[#20B120]",
    free: "bg-[#20B120]",
    pro: "bg-[#164F62]",
    premium: "bg-[#299FC7]",
  };

  useEffect(() => {
    const onGetComplaint = async () => {
      try {
        const [complaint, project, user] = await Promise.all([
          ComplaintService.onGetComplaintById(complaintId),
          ProjectService.getProjectById(projectId),
          UserService.getUserById(userId),
        ]);

        const complaintInfos: ComplaintItem = {
          accusedInfo: {
            createdAt: new Date(user.createdAt).toLocaleDateString("pt-BR"),
            email: user.email,
            name: user.name,
            reportedLinkstobe: project.linkstoBe,
            reportedLinkstobePlan:
            //@ts-ignore
              jwtDecode(project.role)?.role.toLocaleLowerCase() || "",
            cellphone: user?.cellphone,
          },
          complainantInfo: {
            name: complaint.name,
            email: complaint.email,
          },
          complaintDetails: {
            comment: complaint.comments,
            type: complaint.type,
            createdAt: new Date(complaint.createdAt).toLocaleDateString(
              "pt-BR"
            ),
          },
        };

        setComplaintInfo(complaintInfos);
      } catch (error) {
        console.log("DetailedComplaintModal: ", error);
      }
    };

    onGetComplaint();
  }, []);

  return (
    <Modal.Root>
      <Modal.OpenButton>{children}</Modal.OpenButton>
      <Modal.Container className="max-h-[95%] overflow-y-auto">
        <Modal.Header>
          <Modal.Title title="Dados da denúncia" />
        </Modal.Header>
        <Modal.Content>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <h2 className="font-semibold text-lg">Dados do denunciado</h2>

              <div className="flex flex-col sm:flex-row sm:gap-2 sm:items-center">
                <div>
                  <img
                    src="https://github.com/cvitorandrade.png"
                    alt=""
                    className="rounded-full border size-12 justify-self-center"
                  />
                </div>

                <div className="flex flex-col gap-2 sm:gap-0">
                  <h4 className="font-medium text-lg text-center sm:text-start">
                    {complaintItem.accusedInfo.name}
                  </h4>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex gap-1 items-center">
                      <Mail size={15} />

                      <span className="text-sm">
                        {complaintItem.accusedInfo.email}
                      </span>
                    </div>

                    {complaintItem.accusedInfo?.cellphone && (
                      <div className="flex gap-1 items-center">
                        <Phone size={15} />

                        <span className="text-sm">
                          {complaintItem.accusedInfo?.cellphone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <BadgeInfo size={20} />

                <h4 className="font-semibold">Linkstobe/</h4>

                <span>{complaintItem.accusedInfo.reportedLinkstobe}</span>
              </div>

              <div className="flex gap-2 items-center">
                <Calendar size={20} />

                <h4 className="font-semibold">Criado em:</h4>

                <span>{complaintItem.accusedInfo.createdAt}</span>
              </div>

              <div className="flex gap-2 items-center">
                <Crown size={20} />

                <h4 className="font-semibold">Plano:</h4>

                <span>
                  <Badge
                    className={
                      roleStyle[complaintItem.accusedInfo.reportedLinkstobePlan]
                    }
                  >
                    {complaintItem.accusedInfo.reportedLinkstobePlan.toLocaleUpperCase()}
                  </Badge>
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
              <h2 className="font-semibold text-lg">Dados do denuciante</h2>

              <div className="flex gap-2 items-center">
                <User size={20} />

                <h4 className="font-semibold">Nome:</h4>

                <span>{complaintItem.complainantInfo.name}</span>
              </div>

              <div className="flex gap-2 items-center flex-wrap">
                <Mail size={20} />

                <h4 className="font-semibold whitespace-nowrap">Email:</h4>

                <span className="whitespace-nowrap">
                  {complaintItem.complainantInfo.email}
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
              <h2 className="font-semibold text-lg">Dados da denúncia</h2>

              <div className="flex gap-2 items-center flex-wrap">
                <TriangleAlert size={20} />

                <h4 className="font-semibold whitespace-nowrap">
                  Tipo de atividade abusiva:
                </h4>

                <span className="whitespace-nowrap">
                  {complaintItem.complaintDetails.type}
                </span>
              </div>

              <div className="flex gap-2 items-center">
                <Calendar size={20} />

                <h4 className="font-semibold">Data da denúncia:</h4>

                <span>{complaintItem.complaintDetails.createdAt}</span>
              </div>

              <div className="bg-neutral-100 p-3 rounded-lg">
                <h3 className="font-medium text-stone-700">Comentário</h3>

                <p className="font-medium text-sm">
                  {complaintItem.complaintDetails.comment}
                </p>
              </div>
            </div>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <Modal.CloseButton>
            <Button className="text-white font-medium text-base py-3 px-11 bg-[#164F62] mt-1">
              Fechar
            </Button>
          </Modal.CloseButton>
        </Modal.Footer>
      </Modal.Container>
    </Modal.Root>
  );
}
