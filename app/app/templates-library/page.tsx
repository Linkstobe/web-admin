'use client'

import ColorPicker from "@/components/color-picker"
import ConfirmationModal from "@/components/confirmation-modal"
import ImageUploadModal from "@/components/image-upload-modal"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePermission } from "@/hook/use-permission"
import { useToast } from "@/hooks/use-toast"
import { IPainel } from "@/interfaces/IPanels"
import { IProject } from "@/interfaces/IProjects"
import { handleGetAvailableFontsList } from "@/lib/available-fonts-list"
import { cn } from "@/lib/utils"
import { PainelService } from "@/services/panel.service"
import { ProjectService } from "@/services/project.service"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { Pagination, PaginationItem, Stack } from "@mui/material"
import { randomBytes } from "crypto"
import { Check, ChevronsUpDownIcon, DiscAlbum, Eye, Image, Palette, Play, Scan, Server, SquareSquare, Type, X } from "lucide-react"
import { AiOutlineSpotify, AiOutlineYoutube } from "react-icons/ai";
import { useEffect, useState } from "react"
import { Modal } from "@/components/modal"

export default function TemplatesLibrary () {
  const { toast } = useToast()
  const { canEdit } = usePermission()

  const projectWithAllAdvancedPanels = 1499


  // Left Sidebar

  const [selectedSection, setSelectedSection] = useState<string>("template-library")
  const [availableTemplates, setAvailableTemplates] = useState<IProject[]>([])
  const [initialAvailableTemplates, setInitialAvailableTemplates] = useState<IProject[]>([])

  const [availableTemplatesCurrentPage, setAvailableTemplatesCurrentPage] = useState<number>(1)
  const templatesPerPage = 12

  const paginatedAvailablesTemplates = initialAvailableTemplates.slice(
    (availableTemplatesCurrentPage - 1) * templatesPerPage,
    availableTemplatesCurrentPage * templatesPerPage
  )

  const onAvailablesTemplatesPageChange = (event: any, page: number) => {
    setAvailableTemplatesCurrentPage(page)
  }

  // Right Sidebar

  const [seeMore, setSeeMore] = useState<boolean>(false)
  const [seeFullImage, setSeeFullImage] = useState<boolean>(false)
  const [imageUploadModalIsOpen, setImageUploadModalIsOpen] = useState<boolean>(false)

  const [selectedTypeToLink, setSelectedTypeToLink] = useState<string>("Avançados")
  const typesOfPanelsToLink = ["Avançados", "Música/Vídeo"]
  const [filteredTypesOfPanelsToLink, setFilteredTypesOfPanelsToLink] = useState<string[]>(typesOfPanelsToLink)
  const [selectedMediasToLink, setSelectedMediasToLink] = useState<string[]>([])

  const [advancedPanelsModels, setAdvancedPanelsModels] = useState<IPainel[]>([])
  const [advancedPanelsModelsCurrentPage, setAdvancedPanelsModelsCurrentPage] = useState<number>(1)
  const advancedPanelsModelsPerPage = 12
  const [selectedPanelToLinkId, setSelectedPanelToLinkId] = useState<number | null>(null)
  const [selectedPanelToLinkType, setSelectedPanelToLinkType] = useState<string>("")

  const secondLayerImageUrl = "https://srv538807.hstgr.cloud/uploads/file-1728842785555-452376818.webp"

  const paginatedAdvancedPanelsModels = advancedPanelsModels.slice(
    (advancedPanelsModelsCurrentPage - 1) * advancedPanelsModelsPerPage,
    advancedPanelsModelsCurrentPage * advancedPanelsModelsPerPage
  )

  const [templateDemonstrationImageUrl, setTemplateDemonstrationImageUrl] = useState<string>("")

  const templateVisibilityTypes = ["Tela de novo link", "Tela de customize", "Tela de novo link + Tela de customize"]
  const [selectedTemplateVisibilityType, setSelectedTemplateVisibilityType] = useState("Tela de novo link + Tela de customize")

  const templateBackgroundTypes = ["Cor", "Background"]
  const [selectedTemplateBackgroundType, setSelectedTemplateBackgroundType] = useState<string>("Cor")
  const [templateBackgroundColor, setTemplateBackgroundColor] = useState<string>("rgba(175, 51, 242)")
  const [templateBackgroundImageUrl, setTemplateBackgroundImageUrl] = useState<string>("")

  const templateCoverTypes = ["Sem capa", "Com capa"]
  const [selectedTemplateCoverType, setSelectedTemplateCoverType] = useState<string>("Sem capa")

  const [projectTitleColor, setProjectTitleColor] = useState<string>("rgba(175, 51, 242)")
  const [selectedProjectFont, setSelectedProjectFont] = useState<string>("Roboto")
  const availableFonts = handleGetAvailableFontsList()

  const [availableFontsCurrentPage, setAvailableFontsCurrentPage] = useState<number>(1)
  const [filteredAvailablesFonts, setFilteredAvailablesFonts] = useState<{ name: string }[]>(availableFonts)
  const fontsPerPage = 8

  const paginatedFonts = filteredAvailablesFonts.slice(
    (availableFontsCurrentPage - 1) * fontsPerPage,
    availableFontsCurrentPage * fontsPerPage
  )

  const [selectedCoverType, setSelectedCoverType] = useState<string>("gradient")
  const coverFillTypes = ["Cor", "Imagem"]
  const [selectedCoverFillType, setSelectedCoverFillType] = useState<string>("Cor")
  const [projectCoverColor, setProjectCoverColor] = useState<string>("rgba(175, 51, 242)")
  const [projectCoverImageUrl, setProjectCoverImageUrl] = useState<string>("")

  const onAdvancedPanelsModelsPageChange = (event: any, page: number): void => {
    setAdvancedPanelsModelsCurrentPage(page)
  }

  const onFontPageChange = (event: any, page: number) => {
    setAvailableFontsCurrentPage(page)
  }

  const onFilterFont = (value: string): void => {
    if (value.trim() === "") {
      setFilteredAvailablesFonts(availableFonts) 
      return
    }

    const filteredData = availableFonts.filter(({ name }) =>
      name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredAvailablesFonts(filteredData)
    setAvailableFontsCurrentPage(1)
  }
  
  const onFilterPanelTypeToLink = (value: string): void => {
    if (value.trim() === "") {
      setFilteredTypesOfPanelsToLink(typesOfPanelsToLink) 
      return
    }

    const filteredData = typesOfPanelsToLink.filter((type) =>
      type.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredTypesOfPanelsToLink(filteredData)
  }

  const onImageUpload = (imageUrl: string) => {
    setTemplateDemonstrationImageUrl(imageUrl)
  }

  const onTemplateBackgroundUpload = (imageUrl: string) => {
    setTemplateBackgroundImageUrl(imageUrl)
  }

  const onCoverImageUpload = (imageUrl: string) => {
    setProjectCoverImageUrl(imageUrl)
  }

  const onSelectMediaToLink = (media: string) => {
    const hasBeenAdded = selectedMediasToLink.includes(media)
    if (hasBeenAdded) {
      setSelectedMediasToLink(prev => prev.filter((value) => value !== media))
      return
    }
    setSelectedMediasToLink(prev => [...prev, media])
  }

  const reorder = (list, startIndex, endIndex) => {
    const array = Array.from(list);
    const [removed] = array.splice(startIndex, 1);
    array.splice(endIndex, 0, removed);
    return array;
  }

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      availableTemplates,
      result.source.index,
      result.destination.index
    )

    //@ts-ignore
    setAvailableTemplates(items)
  }

  const onGetPanelsModels = async () => {
    try {
      const allAdvancedPanelsModels = await PainelService.getPainelByProjectId(projectWithAllAdvancedPanels)
      const validAdvancedPanelsModels = allAdvancedPanelsModels.filter(({ productsArray }) => !productsArray[0]?.isModel)
      const ordenedAdvancedPanelsModels = validAdvancedPanelsModels.sort((a, b) => a.order_id - b.order_id);

      setAdvancedPanelsModels(ordenedAdvancedPanelsModels)
      setSelectedPanelToLinkId(ordenedAdvancedPanelsModels[0].id)
    } catch (error) {
      console.log("PanelsLibrary: ", error)
    }
  }

  const onOrderTemplates = async () => {
    try {
      const userCanEdit = canEdit()
      if (!userCanEdit) {
        toast({
          variant: "destructive",
          title: "Erro ao ordenar os templates",
          description: "Você não possui permissão para ordenar os templates. Entre em contato com o administrador.",
        })
        return
      }

      await Promise.all(
        availableTemplates.map((project, index) => {
          return ProjectService.updateProjectById(project.id, {
            config: {
              ...project.config,
              order_id: index
            }
          })
        })
      )

      toast({
        variant: "success",
        title: "Templates ordenado!",
        description: "Os templates foram ordenados com sucesso.",
      });

      await onGetTemplates()
    } catch (error) {
      console.log("TemplatesLibrary: ", error)
      toast({
        variant: "destructive",
        title: "Erro ao ordenar os templates",
        description: "Ocorreu um erro ao ordenar os templates. Tente novamente.",
      })
    }
  }

  const onDeleteTemplate = async (id: number) => {
    try {
      const userCanEdit = canEdit()
      if (!userCanEdit) {
        toast({
          variant: "destructive",
          title: "Erro ao exluir template",
          description: "Você não possui permissão para excluir o template. Entre em contato com o administrador.",
        })
        return
      }

      const project = await ProjectService.getProjectById(id)

      await ProjectService.updateProjectById(id, {
        config: {
          ...project.config,
          isTemplate: false,
        }
      })

      // await ProjectService.deleteProjectByID(id)

      toast({
        variant: "success",
        title: "Template excluído!",
        description: "O template foi excluído com sucesso.",
      });

      await onGetTemplates()
    } catch (error) {
      console.log("TemplatesLibrary: ", error)
      toast({
        variant: "destructive",
        title: "Erro ao excluir o template",
        description: "Ocorreu um erro ao excluir o template. Tente novamente.",
      })
    }
  }

  const onCreateNewTemplate = async () => {
    try {
      const userCanEdit = canEdit()
      if (!userCanEdit) {
        toast({
          variant: "destructive",
          title: "Erro ao criar novo template",
          description: "Você não possui permissão para criar um novo template. Entre em contato com o administrador.",
        })
        return
      }

      const accountWithTemplatesId = 1425
      const logo_url = "https://srv538807.hstgr.cloud/uploads/file-1727977861614-988019085.webp"
      const linkstoBe = "tema_novo-" + randomBytes(4).toString('hex')

      const headerStyleContainer = {
        // "gradient": `
        //   border-radius: 1.2rem 1.2rem 50% 50%;
        //   ${selectedCoverFillType === "Cor" ? `background: radial-gradient(circle at top, ${projectCoverColor.replace(")", ",.7)").replace("rgb", "rgba")} 50%, ${projectCoverColor.replace(")", ",0)").replace("rgb", "rgba")} 79%);` : ""}
          
        // `,
        "gradient": `
          border-radius: 1.2rem;
          ${selectedCoverFillType === "Cor" ? `background: linear-gradient(to bottom, ${projectCoverColor} 0%, rgba(0,0,0, 0) 100%);` : ""}
          
        `,
        "rounded": `
          border-radius: 1.2rem;
          ${selectedCoverFillType === "Cor" ? `background: ${projectCoverColor};` : ""}
        `,
        "rounded-bottom-full": `
          border-radius: 1.2rem 1.2rem 50% 50%;
          ${selectedCoverFillType === "Cor" ? `background: ${projectCoverColor};` : ""}
        `
      }

      const headerStyleImage = {
        "gradient": `
          border-radius: 1.2rem;
          mask-image: linear-gradient(rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%);
          object-fit: cover;
        `,
        "rounded": `
          border-radius: 1.2rem;
          object-fit: cover; 
        `,
        "rounded-bottom-full": `
          border-radius: 1.2rem 1.2rem 50% 50%;
          object-fit: cover;
        `
      }

      //@ts-ignore
      const newTemplateSettings: IProject = {
        title: linkstoBe,
        title_classname: `font-size: 20px; text-align: center; color: ${projectTitleColor}; font-family: ${selectedProjectFont};`,
        description: "",
        description_classname: `font-size: 18px; text-align: center; color: ${projectTitleColor}; font-family: ${selectedProjectFont};`,
        hasCover: selectedTemplateCoverType === "Com capa",
        background_image: selectedTemplateBackgroundType === "Background" ? templateBackgroundImageUrl : "",
        background_color: selectedTemplateBackgroundType === "Cor" ? templateBackgroundColor : "",
        background_effect: "static",

        banner_url: selectedCoverFillType === "Imagem" ? projectCoverImageUrl : "", //deve ser vazio caso selecionado seja Cor

        config: {
          isTemplate: true,
          templateDemonstrationImageUrl,
          order_id: initialAvailableTemplates.length,
          templateVisibility: selectedTemplateVisibilityType,

          headerModel: selectedCoverType, // gradient - rounded - rounded-bottom-full
          headerStyle: selectedCoverFillType === "Imagem" ? "image" : "color", // image - color
          headerStyleContainer: headerStyleContainer[selectedCoverType],
          headerStyleImage: headerStyleImage[selectedCoverType],
          containerColor: selectedCoverFillType !== "Imagem" ? projectCoverColor : "",
          selectedCustomTheme: projectCoverImageUrl ? "image" : "color",
          selectedThemeTemplate: "",
          startGradientColor: "",
          endGradientColor: "",
          themeColor: templateBackgroundImageUrl ? "" : templateBackgroundColor,

          selectedLinkPanelId: selectedPanelToLinkId, // devemos passar o id do painel usado
          selectedLinkPanelType: selectedPanelToLinkType, //tipo do painel escolhido, hoje só temos avançados
          panelBackgroundColor: "rgba(0,0,0,1)", //para personalizado talvez básico
          panelTextColor: "rgba(255,255,255,1)", //para personalizado talvez básico
          panelIdLinkedToTemplate: selectedPanelToLinkId,

          mediasLinkedToTemplate: selectedMediasToLink
        },

        arquived: false,
        links: [],
        blocked: false,
        linkstoBe,
        logo_url,
        user_id: accountWithTemplatesId,
      }

      //@ts-ignore
      await ProjectService.createNewProject(newTemplateSettings)

      toast({
        variant: "success",
        title: "Template criado!",
        description: "O template foi criado com sucesso.",
      });

      await onGetTemplates()
    } catch (error) {
      console.log("TemplateLibrary: ", error)
      toast({
        variant: "destructive",
        title: "Erro ao criar novo template",
        description: "Ocorreu um erro ao criar o template. Tente novamente.",
      })
    }
  }

  const onGetTemplates = async () => {
    try {
      const projects: IProject[] = await ProjectService.getAllProject()
      //@ts-ignore
      const templates: IProject[] = projects.filter(({ config }) => config.isTemplate).sort((a, b) => a.config.order_id - b.config.order_id )

      console.log({ templates })

      setAvailableTemplates(templates)
      setInitialAvailableTemplates(templates)
    } catch (error) {
      console.log("TemplatesLibrary: ", error)
    }
  }

  useEffect(() => {
    onGetPanelsModels()
    onGetTemplates()
  }, [])


  return (
    <div
      className="w-full grid grid-cols-[1fr_3fr_1.5fr] gap-4"
    >
      <div
        className="gap-4 rounded-lg shadow-md bg-white border-2 overflow-auto border-[#164F62]"
        style={{ height: "calc(100vh - 100px)"}}
      >
        <div
          className="flex flex-col gap-4 p-2"
        >
          <div
            className="flex w-full shadow-md border rounded-lg"
          >
            <Accordion type="multiple" className="w-full p-2">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-primary-blue">Biblioteca de templates</AccordionTrigger>
                <AccordionContent
                  className="flex flex-col gap-4"
                >
                  <div
                    className="grid grid-cols-3 gap-4 w-full"
                  >
                    {
                      paginatedAvailablesTemplates.map(({ id, config }, index) => (
                        <div
                          key={index}
                          className="aspect-[478/835] w-full relative cursor-pointer group"
                        >
                          <img 
                            //@ts-ignore
                            src={config?.templateDemonstrationImageUrl} 
                            alt="" 
                            className="w-full rounded-lg"
                          />

                          <ConfirmationModal
                            title="Confirmação para exclusão de template da visualização"
                            description="Você está prestes a excluir um template da visualização. Isso fará com que esse template pare de ser exibido para ser escolhido pelos usuários. Deseja continuar?"
                            onConfirm={() => onDeleteTemplate(id)}
                          >
                            <span
                              className="absolute left-1/2 top-full text-red-600 font-semibold text-sm opacity-0 transform -translate-x-1/2 -translate-y-full group-hover:opacity-100 group-hover:-translate-y-0.5 transition-all duration-500 ease-out z-[4] underline"
                            >
                              Excluir
                            </span>
                          </ConfirmationModal>
                        </div>
                      ))
                    }
                  </div>
                  <div
                    className="flex justify-end items-center"
                  >
                    <Stack>
                      <Pagination 
                        count={Math.ceil(initialAvailableTemplates.length / templatesPerPage)} 
                        page={availableTemplatesCurrentPage}
                        onChange={onAvailablesTemplatesPageChange}
                        variant="outlined" 
                        shape="rounded"
                        renderItem={(item) => {
                          if (item.type === 'previous' || item.type === 'next') {
                            return (
                              <PaginationItem
                                {...item}
                              />
                            )
                          }
                          return null
                        }} 
                      />
                    </Stack>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-primary-blue">Ordenar templates</AccordionTrigger>
                <AccordionContent>
                  <div
                    className="flex flex-col gap-4"
                  >
                    <div
                      className="overflow-auto"
                      style={{ height: "calc(100vh - 500px)" }}
                    >
                      <DragDropContext
                        onDragEnd={onDragEnd}
                      >
                        <div
                          className="flex flex-col gap-2"
                        >
                          {
                            Array.from({ length: Math.ceil(availableTemplates.length / 3) }).map((_, rowIndex) => (
                              <Droppable
                                key={`droppable-row-${rowIndex}`}
                                droppableId={`droppable-row-${rowIndex}`}
                                type="list"
                                direction="horizontal"
                              >
                                {
                                  (provided) => (
                                    <div
                                      className="grid grid-cols-3 gap-2 overflow-hidden w-full"
                                      style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                    >
                                      {
                                        availableTemplates
                                          .slice(rowIndex * 3, (rowIndex + 1) * 3)
                                          .map(({ id, config }, index) => (
                                            <Draggable
                                              key={id}
                                              draggableId={`advanced-panel-model-${id}`}
                                              index={rowIndex * 3 + index}
                                            >
                                              {
                                                ({ dragHandleProps, draggableProps, innerRef }) => (
                                                  <div
                                                    className="aspect-[478/835] rounded-lg w-full cursor-pointer"
                                                    ref={innerRef}
                                                    {...draggableProps}
                                                    {...dragHandleProps}
                                                  >
                                                    <img 
                                                      //@ts-ignore
                                                      src={config?.templateDemonstrationImageUrl}
                                                      alt=""
                                                      className="w-full rounded-lg"
                                                    />
                                                  </div>
                                                )
                                              }
                                            </Draggable>
                                          ))
                                      }
                                      {provided.placeholder}
                                    </div>
                                  )
                                }
                              </Droppable>
                            ))
                          }
                        </div>
                      </DragDropContext>
                    </div>

                    <div
                      className="flex gap-2"
                    >
                      <Button
                        className="flex-1"
                        variant="destructive"
                        onClick={() => setAvailableTemplates(initialAvailableTemplates)}
                        disabled={availableTemplates === initialAvailableTemplates}
                      >
                        Reverter
                      </Button>

                      <Button
                        className="flex-1"
                        variant="success"
                        disabled={availableTemplates === initialAvailableTemplates}
                        onClick={onOrderTemplates}
                      >
                        Salvar
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      <div
        className="gap-4 p-2 rounded-lg shadow-md bg-white border-2 border-[#164F62]"
        style={{ height: "calc(100vh - 100px)"}}
      >

        <div
          className="w-full h-full flex justify-center items-center"
        >
          <div
            className="max-w-[20rem] border-2 rounded-2xl shadow-2xl w-full grid grid-rows-2 h-full overflow-auto"
            style={{ 
              height: "calc(100vh - 300px)",
              gridTemplateRows: "auto auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              background: selectedTemplateBackgroundType === "Cor"
                ? templateBackgroundColor
                : `url("${templateBackgroundImageUrl}") center/cover no-repeat`
            }}
          >
            <div
              className="h-full"
            >
              <div
                className="w-full max-w-full rounded-t-2xl h-72"
              >
                <div
                  className="w-full flex justify-center items-center h-full flex-col gap-2 relative"

                  style={{
                    background: selectedCoverFillType === "Cor" && selectedTemplateCoverType === "Com capa"
                      ? selectedCoverType !== "gradient" ? projectCoverColor : `linear-gradient(to bottom, ${projectCoverColor} 0%, transparent 100%)`
                      : "none",
                    borderRadius: selectedCoverType === "rounded-bottom-full" && selectedTemplateCoverType === "Com capa"
                      ? "0 0 50% 50%"
                      : ".5rem"
                  }}
                >
                  {
                    (projectCoverImageUrl && selectedTemplateCoverType === "Com capa" && selectedCoverFillType === "Imagem") &&
                    <img 
                      src={projectCoverImageUrl} 
                      alt=""
                      className="absolute object-cover z-10 w-full h-full"
                      style={{
                        borderRadius: selectedCoverType === "rounded-bottom-full" && selectedTemplateCoverType === "Com capa"
                          ? "0 0 50% 50%"
                          : ".5rem",
                        maskImage: selectedCoverType === "gradient" ? 'linear-gradient(to bottom, black 0%, transparent 100%)' : "",
                        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                        // maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                        // WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                      }}
                    />
                  }

                  <div
                    className="w-full flex justify-center items-center h-full flex-col gap-2 relative z-20"
                  >
                    <img
                      src="https://srv538807.hstgr.cloud/uploads/file-1727977861614-988019085.webp" 
                      alt=""
                      className="rounded-full w-24"
                    />

                    <div
                      className="flex flex-col gap-1 text-center"
                    >
                      <h3 
                        className="font-bold text-base"
                        style={{ 
                          fontFamily: selectedProjectFont,
                          color: projectTitleColor
                        }}
                      >
                        Tema Novo
                      </h3>

                      <p 
                        className="font-medium text-sm"
                        style={{ 
                          fontFamily: selectedProjectFont,
                          color: projectTitleColor
                        }}
                      >
                        Aqui será a descrição
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              <div
                className="w-full rounded-b-2xl min-h-full"
              >
                <div
                  className="w-full flex justify-center mt-4"
                >
                  <div
                    className="w-[95%] flex flex-col gap-4"
                  >
                    {
                      advancedPanelsModels
                        .filter(({ id }) => id === selectedPanelToLinkId)
                        .map(({ id, background_url, button_url }) => (
                        <div 
                          className="relative w-full rounded-xl aspect-[800/250] border"
                          key={id}
                        >
                          <img src={background_url} alt="" className="absolute w-full h-full rounded-lg z-1" />
                          <img src={secondLayerImageUrl} alt="" className="absolute h-full w-2/5 object-cover rounded-lg z-[2]" />
                          <img src={button_url} alt="" className="absolute w-full h-full rounded-lg z-[3]" />
                        </div>
                      ))
                    }

                    {
                      selectedMediasToLink.map((media) => (
                        <div
                          className="w-full flex justify-center items-center border-2 border-primary-blue border-dashed"
                        >
                          { 
                            media === "music" 
                              ? <AiOutlineSpotify size={128} className="text-primary-blue" />  
                              : <AiOutlineYoutube size={128} className="text-primary-blue" /> 
                          }
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>

      <div
        className="overflow-auto border-2 border-[#164F62] shadow-md bg-white rounded-lg"
        style={{ height: "calc(100vh - 100px)"}}
      >
        <div
          className="flex flex-col gap-4 p-2"
        >
          <div
            className="flex flex-col gap-2 w-full py-4 shadow-md border rounded-lg overflow-hidden transition-all duration-700"
            style={{ maxHeight: seeMore ? "200rem" : "9rem" }}
          >
            <div
              className="flex gap-2 w-full rounded-lg px-2 items-center justify-between"
            >
              <h3
                className="text-primary-blue font-bold"
              >
                Instruções
              </h3>
              <span
                className="font-semibold cursor-pointer text-neutral-500"
                onClick={() => setSeeMore(b => !b)}
              >
                ver {seeMore ? "menos" : "mais"}
              </span>
            </div>

            <div className="flex flex-col gap-4 px-2 text-zinc-800 text-sm">
              <p className="text-justify">
                Para criar um template personalizado e funcional, cada seção do painel foi projetada para oferecer máxima flexibilidade e controle. Abaixo estão as instruções detalhadas para configurar cada parte do template:
              </p>

              <ol className="list-inside list-decimal flex flex-col gap-2">
                <li>
                  <strong>Armazenamento dos Templates:</strong>
                  <ul className="list-disc list-inside pl-6">
                    <li>
                      Os novos templates criados são vinculados a uma conta específica, garantindo organização e controle.
                    </li>
                    <li>
                      Para gerenciar ou alterar as permissões relacionadas a essa conta, entre em contato com o administrador.
                    </li>
                    <li
                      className="text-red-500"
                    >
                      <strong>
                        Os templates não podem ser apagados pela aplicação da Linkstobe. E nem por outra tela do Web Admin se não essa. Ao realizarmos a exlusão por essa tela de isso ocorre de uma forma específica e controlada.
                      </strong>
                    </li>
                  </ul>
                </li>

                <li>
                  <strong>Imagem de Demonstração:</strong>
                  <ul className="list-disc list-inside pl-6">
                    <li>
                      Essa imagem será exibida como prévia do template para o usuário. 
                    </li>
                    <li>
                      Para melhor performance, recomendamos uma proporção de <strong>478x835 pixels</strong>.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Vincular Painel:</strong>
                  <ul className="list-disc list-inside pl-6">
                    <li>
                      Escolha o tipo de painel que será vinculado ao template.
                    </li>
                    <li>
                      Configure qual painel será utilizado para personalizar e exibir o conteúdo do template.
                    </li>
                    <li>
                      É possível vincular painéis dos tipos YouTube e Spotify, mas a escolha de um painel avançado ainda é necessária.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Visibilidade:</strong>
                  <ul className="list-disc list-inside pl-6">
                    <li>
                      Defina onde o template será exibido para escolha. As opções disponíveis atualmente são:
                    </li>
                    <ul className="list-disc pl-8">
                      <li><strong>Tela de Novos Links:</strong> Exibe o template para a criação de novos links.</li>
                      <li><strong>Tela de Personalização:</strong> Mostra o template durante o processo de customização.</li>
                      <li>
                        Você pode selecionar ambas as opções ou apenas uma, dependendo da necessidade.
                      </li>
                    </ul>
                  </ul>
                </li>
                <li>
                  <strong>Background:</strong>
                  <ul className="list-disc list-inside pl-6">
                    <li>
                      Escolha o fundo do template, que pode ser uma <strong>cor sólida</strong> ou uma <strong>imagem personalizada</strong>.
                    </li>
                    <li>
                      O background é essencial para definir a estética principal do seu template.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Capa:</strong>
                  <ul className="list-disc list-inside pl-6">
                    <li>
                      Determine se o template terá ou não uma capa. 
                    </li>
                    <li>
                      Caso opte por incluir, escolha entre três formatos disponíveis e configure o preenchimento com uma <strong>cor sólida</strong> ou <strong>imagem</strong>.
                    </li>
                    <li>
                      A capa é construída utilizando uma proporção quadrada, de <strong>1:1</strong>. Para melhores resultados, recomendamos que as imagens de capa sigam essa proporção. <strong>Exemplo: 64x64 128x128, 256x256 pixels</strong>
                      </li>
                  </ul>
                </li>
                <li>
                  <strong>Tipografia:</strong>
                  <ul className="list-disc list-inside pl-6">
                    <li>
                      Configure a fonte utilizada nos textos do projeto, incluindo o título e a descrição.
                    </li>
                    <li>
                      A descrição é opcional, mas tanto o título quanto a descrição compartilham a mesma fonte.
                    </li>
                    <li>
                      É possível definir cores distintas para o título e a descrição para maior personalização.
                    </li>
                  </ul>
                </li>
              </ol>

              <p className="text-justify">
                Com essas configurações, você terá total controle sobre a aparência e o comportamento do seu template, garantindo uma experiência visual e funcional consistente.
              </p>
            </div>

          </div>

          <div
            className="flex flex-col gap-2 w-full py-4 shadow-md border rounded-lg"
          >
            <div
              className="flex flex-col gap-2 w-full rounded-lg px-2"
            >
              <h3
                className="text-primary-blue font-bold"
              >
                Vincular painel ao template
              </h3>
            </div>

            <div
              className="w-full flex flex-col gap-2 px-2"
            >
              <h2
              className="font-medium text-zinc-600"
              >
                Tipo do painel
              </h2>

              <Popover>
                <PopoverTrigger
                  asChild
                >
                  <Button
                    variant="outline"
                    role="combobox"
                    className="justify-between w-full"
                  >
                    { selectedTypeToLink || "Selecione o tipo do painel..."}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent>
                  <Command>
                    <CommandInput 
                      placeholder="Pesquise por projeto..." 
                      onInput={e => onFilterPanelTypeToLink((e.target as HTMLInputElement).value)}
                    />
                    <CommandList>
                      <CommandEmpty>Projeto não encontrado</CommandEmpty>
                      <CommandGroup>
                        {
                          filteredTypesOfPanelsToLink.map((type, index) => (
                            <CommandItem
                              key={index}
                              value={type}
                              onSelect={(currentValue) => {
                                setSelectedTypeToLink(currentValue)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedTypeToLink === type ? "opacity-100" : "opacity-0"
                                )}
                              />
                              { type }
                            </CommandItem>
                          ))
                        }
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {
              selectedTypeToLink === "Avançados" &&
              <div
                className="w-full flex flex-col gap-2 px-2"
              >
                <h2
                className="font-medium text-zinc-600"
                >
                  Selecione o painel
                </h2>

                <div
                  className="grid grid-cols-4 gap-2"
                >
                  {
                    paginatedAdvancedPanelsModels.map(({ id, painel_style, background_url, button_url }, index) => (
                      <div
                        key={index}
                        className={cn(
                          "border-2 p-0.5 rounded-lg border-dashed cursor-pointer",
                          selectedPanelToLinkId === id  ? "border-fuchsia-600" : ""
                        )}
                        onClick={() => {
                          setSelectedPanelToLinkId(id)
                          setSelectedPanelToLinkType(painel_style)
                        }}
                      >
                        <div
                          className="relative w-full rounded-xl aspect-[800/250] border"
                        >
                          <img src={background_url} alt="" className="absolute w-full h-full rounded-lg z-1" />

                          <img src={secondLayerImageUrl} alt="" className="absolute h-full w-2/5 object-cover rounded-lg z-[2]" />

                          <img src={button_url} alt="" className="absolute w-full h-full rounded-lg z-[3]" />
                        </div>
                      </div>
                    ))
                  }
                </div>
                
                <div
                  className="flex justify-end items-center"
                >
                  <Stack>
                    <Pagination 
                      count={Math.ceil(advancedPanelsModels.length / advancedPanelsModelsPerPage)} 
                      page={advancedPanelsModelsCurrentPage}
                      onChange={onAdvancedPanelsModelsPageChange}
                      variant="outlined" 
                      shape="rounded"
                      renderItem={(item) => {
                        if (item.type === 'previous' || item.type === 'next') {
                          return (
                            <PaginationItem
                              {...item}
                            />
                          )
                        }
                        return null
                      }} 
                    />
                  </Stack>
                </div>
              </div>
            }

            {
              selectedTypeToLink === "Música/Vídeo" &&
              <div
                className="w-full flex flex-col gap-2 px-2"
              >
                <h2
                  className="font-medium text-zinc-600"
                >
                  Selecione as mídias
                </h2>

                <div
                  className="flex items-center gap-2"
                >
                  <div
                    className={cn(
                      "p-1 border-2 rounded-lg border-dashed cursor-pointer",
                      selectedMediasToLink.includes("music") ? "border-fuchsia-500" : ""
                    )}
                    onClick={() => onSelectMediaToLink("music")}
                  >
                    <AiOutlineSpotify 
                      size={35}
                      className="text-primary-blue"
                    />
                  </div>

                  <div
                    className={cn(
                      "p-1 border-2 rounded-lg border-dashed cursor-pointer",
                      selectedMediasToLink.includes("video") ? "border-fuchsia-500" : ""
                    )}
                    onClick={() => onSelectMediaToLink("video")}
                  >
                    <AiOutlineYoutube 
                      className="text-primary-blue"
                      size={35}
                    />
                  </div>
                </div>
              </div>
            }
          </div>

          <div
            className="flex flex-col gap-4 w-full py-4 shadow-md border rounded-lg overflow-hidden transition-all duration-700"
            style={{ maxHeight: seeFullImage ? "50rem" : "7rem" }}
          >
            <div
              className="flex gap-2 w-full rounded-lg px-2 items-center justify-between"
            >
              <h3
                className="text-primary-blue font-bold"
              >
                Image de demonstração
              </h3>
              <span
                className="font-semibold cursor-pointer text-neutral-500"
                onClick={() => setSeeFullImage(b => !b)}
              >
                ver {seeFullImage ? "menos" : "mais"}
              </span>
            </div>

            <div className=" flex flex-col gap-4 px-2 text-zinc-800 text-sm">
              {
                templateDemonstrationImageUrl 
                ? (
                  <div
                    className="flex w-full justify-center"
                  >
                    <div
                      className="w-full aspect-[478/375] max-w-40 border-2 rounded-2xl border-fuchsia-500 relative group"
                    >
                      <img 
                        src={templateDemonstrationImageUrl} 
                        alt="" 
                        className="rounded-2xl object-cover w-full group-hover:brightness-50 transition-all duration-300"
                      />

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            className="absolute top-2 right-2"
                          >
                            <X
                              className="absolute text-white opacity-0 top-1 right-1 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                              size={20}
                              onClick={() => setTemplateDemonstrationImageUrl("")}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            Remover imagem
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ) : (
                  <ImageUploadModal
                    isOpen={imageUploadModalIsOpen}
                    onUpload={onImageUpload}
                    aspectRatio={478/835}
                  >
                    <Button
                      className="w-full h-full border border-dashed border-[#164F62] rounded-md"
                      variant="ghost"
                    >
                      Adicionar imagem
                    </Button>
                  </ImageUploadModal>
                )
              }
            </div>
          </div>

          <div
            className="flex flex-col gap-2 w-full py-4 shadow-md border rounded-lg"
          >
            <div
              className="flex flex-col gap-2 w-full rounded-lg px-2"
            >
              <h3
                className="text-primary-blue font-bold"
              >
                Visibilidade
              </h3>
            </div>

            <div
              className="w-full flex flex-col gap-2 px-2"
            >
              <h2
              className="font-medium text-zinc-600"
              >
                Onde o template deve ser visível para escolha
              </h2>

              <Popover>
                <PopoverTrigger
                  asChild
                >
                  <Button
                    variant="outline"
                    role="combobox"
                    className="justify-between w-full"
                  >
                    { selectedTemplateVisibilityType || "Selecione o tipo do painel..."}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent>
                  <Command>
                    <CommandInput 
                      placeholder="Pesquise por visibilidade..." 
                    />
                    <CommandList>
                      <CommandEmpty>Projeto não encontrado</CommandEmpty>
                      <CommandGroup>
                        {
                          templateVisibilityTypes.map((type, index) => (
                            <CommandItem
                              key={index}
                              value={type}
                              onSelect={(currentValue) => {
                                setSelectedTemplateVisibilityType(currentValue)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedTemplateVisibilityType === type ? "opacity-100" : "opacity-0"
                                )}
                              />
                              { type }
                            </CommandItem>
                          ))
                        }
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div
            className="flex flex-col gap-2 w-full py-4 shadow-md border rounded-lg"
          >
            <div
              className="flex flex-col gap-2 w-full rounded-lg px-2"
            >
              <h3
                className="text-primary-blue font-bold"
              >
                Background
              </h3>
            </div>

            <div
              className="w-full flex flex-col gap-2 px-2"
            >
              <h2
              className="font-medium text-zinc-600"
              >
                Escolha entre uma imagem ou cor de fundo
              </h2>

              <Popover>
                <PopoverTrigger
                  asChild
                >
                  <Button
                    variant="outline"
                    role="combobox"
                    className="justify-between w-full"
                  >
                    { selectedTemplateBackgroundType || "Selecione o tipo do background..."}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent>
                  <Command>
                    <CommandInput 
                      placeholder="Pesquise por background..." 
                    />
                    <CommandList>
                      <CommandEmpty>Projeto não encontrado</CommandEmpty>
                      <CommandGroup>
                        {
                          templateBackgroundTypes.map((type, index) => (
                            <CommandItem
                              key={index}
                              value={type}
                              onSelect={(currentValue) => {
                                setSelectedTemplateBackgroundType(currentValue)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedTemplateBackgroundType === type ? "opacity-100" : "opacity-0"
                                )}
                              />
                              { type }
                            </CommandItem>
                          ))
                        }
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {
                selectedTemplateBackgroundType === "Background"
                ? (
                  templateBackgroundImageUrl
                  ? (
                    <div
                      className="flex w-full justify-center"
                    >
                      <div
                        className="w-full aspect-[478/375] max-w-40 border-2 rounded-2xl border-fuchsia-500 relative group"
                      >
                        <img 
                          src={templateBackgroundImageUrl} 
                          alt="" 
                          className="rounded-2xl object-cover w-full group-hover:brightness-50 transition-all duration-300"
                        />

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger
                              className="absolute top-2 right-2"
                            >
                              <X
                                className="absolute text-white opacity-0 top-1 right-1 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                                size={20}
                                onClick={() => setTemplateBackgroundImageUrl("")}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              Remover imagem
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  ) : (
                    <ImageUploadModal
                      isOpen={imageUploadModalIsOpen}
                      onUpload={onTemplateBackgroundUpload}
                      // aspectRatio={478/835}
                    >
                      <Button
                        className="w-full h-full border border-dashed border-[#164F62] rounded-md"
                        variant="ghost"
                      >
                        Adicionar imagem
                      </Button>
                    </ImageUploadModal>
                  )
                  
                ) : (
                  <Popover>
                    <PopoverTrigger>
                      <div
                        className="flex gap-4 items-center border rounded-md p-1"
                      >
                        <div
                          className="size-7 rounded-md border"
                          style={{ background: templateBackgroundColor }}
                        ></div>
                        <span
                          className="font-medium"
                        >
                          {templateBackgroundColor}
                        </span>
                      </div>
                    </PopoverTrigger>

                    <PopoverContent
                      side="left"
                      className="w-fit"
                    >
                      <ColorPicker
                        setColor={setTemplateBackgroundColor}
                        hideColorTypeBtns
                      />
                    </PopoverContent>
                  </Popover>
                )
              }

            </div>
          </div>

          <div
            className="flex flex-col gap-2 w-full py-4 shadow-md border rounded-lg"
          >
            <div
              className="flex flex-col gap-2 w-full rounded-lg px-2"
            >
              <h3
                className="text-primary-blue font-bold"
              >
                Capa
              </h3>
            </div>

            <div
              className="w-full flex flex-col gap-2 px-2"
            >
              <h2
              className="font-medium text-zinc-600"
              >
                Escolha se template deve ou não ter uma capa
              </h2>

              <Popover>
                <PopoverTrigger
                  asChild
                >
                  <Button
                    variant="outline"
                    role="combobox"
                    className="justify-between w-full"
                  >
                    { selectedTemplateCoverType || "Selecione o tipo do background..."}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent>
                  <Command>
                    <CommandInput 
                      placeholder="Pesquise por background..." 
                    />
                    <CommandList>
                      <CommandEmpty>Projeto não encontrado</CommandEmpty>
                      <CommandGroup>
                        {
                          templateCoverTypes.map((type, index) => (
                            <CommandItem
                              key={index}
                              value={type}
                              onSelect={(currentValue) => {
                                setSelectedTemplateCoverType(currentValue)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedTemplateCoverType === type ? "opacity-100" : "opacity-0"
                                )}
                              />
                              { type }
                            </CommandItem>
                          ))
                        }
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {
              selectedTemplateCoverType === "Com capa" &&
              <div
                className="w-full flex flex-col gap-2 px-2"
              >
                <h2
                className="font-medium text-zinc-600"
                >
                  Escolha o formato da capa
                </h2>

                <div
                  className="grid grid-cols-3 gap-4"
                >
                  <div
                    className={cn(
                      `border-2 p-1 rounded-lg border-dashed cursor-pointer`,
                      selectedCoverType === "gradient" ? "border-fuchsia-500" : ""
                    )}
                    onClick={() => setSelectedCoverType("gradient")}
                  >
                    <div
                      className="aspect-square rounded-lg bg-gradient-to-b from-fuchsia-500 to-transparent"
                      style={{
                        background: selectedCoverFillType === "Cor" 
                          ? `linear-gradient(to bottom, ${projectCoverColor} 0%, transparent 100%)` 
                          : "none"
                      }}
                    >
                      {
                        (selectedCoverFillType === "Imagem" && projectCoverImageUrl) &&
                        <img
                          src={projectCoverImageUrl} 
                          alt=""
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                            borderTopRightRadius: ".5rem",
                            borderTopLeftRadius: ".5rem",
                            borderBottomLeftRadius: "50%",
                            borderBottomRightRadius: "50%",
                          }}
                        />
                      }
                    </div>
                  </div>
                  
                  <div
                    className={cn(
                      `border-2 p-1 rounded-lg border-dashed cursor-pointer`,
                      selectedCoverType === "rounded" ? "border-fuchsia-500" : ""
                    )}
                    onClick={() => setSelectedCoverType("rounded")}
                  >
                    <div
                      className="aspect-square rounded-lg bg-fuchsia-500"
                      style={{
                        background: selectedCoverFillType === "Cor" ? projectCoverColor : `url(${projectCoverImageUrl}) center center / cover no-repeat`
                      }}
                    >
                    </div>
                  </div>

                  <div
                    className={cn(
                      `border-2 p-1 rounded-lg border-dashed cursor-pointer`,
                      selectedCoverType === "rounded-bottom-full" ? "border-fuchsia-500" : ""
                    )}
                    onClick={() => setSelectedCoverType("rounded-bottom-full")}
                  >
                    <div
                      className="aspect-square bg-fuchsia-500"
                      style={{ 
                        borderTopRightRadius: ".5rem",
                        borderTopLeftRadius: ".5rem",
                        borderBottomLeftRadius: "50%",
                        borderBottomRightRadius: "50%",
                        background: selectedCoverFillType === "Cor" ? projectCoverColor : `url(${projectCoverImageUrl}) center center / cover no-repeat`
                      }}
                    >

                    </div>
                  </div>
                </div>

                <div
                  className="w-full flex flex-col gap-2 px-2"
                >
                  <h2
                  className="font-medium text-zinc-600"
                  >
                    Tipo de preenchimento da capa
                  </h2>

                  <Popover>
                    <PopoverTrigger
                      asChild
                    >
                      <Button
                        variant="outline"
                        role="combobox"
                        className="justify-between w-full"
                      >
                        { selectedCoverFillType || "Selecione o tipo do background..."}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent>
                      <Command>
                        <CommandInput 
                          placeholder="Pesquise por background..." 
                        />
                        <CommandList>
                          <CommandEmpty>Projeto não encontrado</CommandEmpty>
                          <CommandGroup>
                            {
                              coverFillTypes.map((type, index) => (
                                <CommandItem
                                  key={index}
                                  value={type}
                                  onSelect={(currentValue) => {
                                    setSelectedCoverFillType(currentValue)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedCoverFillType === type ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  { type }
                                </CommandItem>
                              ))
                            }
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {
                    selectedCoverFillType === "Cor"
                    ? (
                      <Popover>
                        <PopoverTrigger>
                          <div
                            className="flex gap-4 items-center border rounded-md p-1"
                          >
                            <div
                              className="size-7 rounded-md border"
                              style={{ background: projectCoverColor }}
                            ></div>
                            <span
                              className="font-medium"
                            >
                              {projectCoverColor}
                            </span>
                          </div>
                        </PopoverTrigger>

                        <PopoverContent
                          side="left"
                          className="w-fit"
                        >
                          <ColorPicker
                            setColor={setProjectCoverColor}
                            hideColorTypeBtns
                          />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      projectCoverImageUrl 
                      ? (
                        <div
                          className="flex justify-center"
                        >
                          <div
                            className="w-full aspect-square rounded-lg max-w-40"
                          >
                            <img 
                              src={projectCoverImageUrl} 
                              alt="" 
                              className="rounded-lg w-full object-cover"
                            />
                          </div>
                        </div>
                      ) : (
                        <ImageUploadModal
                          isOpen={imageUploadModalIsOpen}
                          onUpload={onCoverImageUpload}
                          aspectRatio={1}
                        >
                          <Button
                            className="w-full h-full border border-dashed border-[#164F62] rounded-md"
                            variant="ghost"
                          >
                            Adicionar imagem
                          </Button>
                        </ImageUploadModal>
                      )
                    )
                  }

                </div>


              </div>
            }
          </div>

          <div
            className="flex flex-col gap-2 w-full py-4 shadow-md border rounded-lg"
          >
            <div
              className="flex flex-col gap-2 w-full rounded-lg px-2"
            >
              <h3
                className="text-primary-blue font-bold"
              >
                Tipografia
              </h3>
            </div>

            <div
              className="flex flex-col gap-2"
            >
              <div
                className="w-full flex flex-col gap-2 px-2"
              >
                <h3
                  className="text-primary-blue font-semibold"
                >
                  Título
                </h3>

                <h2
                className="font-medium text-zinc-600"
                >
                  Fonte
                </h2>

                <Popover>
                  <PopoverTrigger
                    asChild
                  >
                    <Button
                      variant="outline"
                      role="combobox"
                      className="justify-between w-full"
                    >
                      { selectedProjectFont|| "Selecione uma fonte..."}
                      <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent>
                    <Command>
                      <CommandInput 
                        placeholder="Pesquise por projeto..." 
                        onInput={e => onFilterFont((e.target as HTMLInputElement).value)}
                      />
                      <CommandList>
                        <CommandEmpty>Projeto não encontrado</CommandEmpty>
                        <CommandGroup>
                          {
                            paginatedFonts.map(({ name }, index) => (
                              <CommandItem
                                key={index}
                                value={name}
                                onSelect={(currentValue) => {
                                  setSelectedProjectFont(currentValue)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedProjectFont === name ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                { name }
                              </CommandItem>
                            ))
                          }
                        </CommandGroup>
                        <div
                          className="flex justify-end"
                        >
                          <Stack>
                            <Pagination 
                              count={Math.ceil(filteredAvailablesFonts.length / fontsPerPage)} 
                              page={availableFontsCurrentPage}
                              onChange={onFontPageChange}
                              variant="outlined" 
                              shape="rounded"
                              renderItem={(item) => {
                                if (item.type === 'previous' || item.type === 'next') {
                                  return (
                                    <PaginationItem
                                      {...item}
                                    />
                                  )
                                }
                                return null
                              }} 
                            />
                          </Stack>
                        </div>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div
                className="w-full flex flex-col gap-2 px-2"
              >
                <h2
                className="font-medium text-zinc-600"
                >
                  Cor
                </h2>

                <Popover>
                  <PopoverTrigger>
                    <div
                      className="flex gap-4 items-center border rounded-md p-1"
                    >
                      <div
                        className="size-7 rounded-md border"
                        style={{ background: projectTitleColor }}
                      ></div>
                      <span
                        className="font-medium"
                      >
                        {projectTitleColor}
                      </span>
                    </div>
                  </PopoverTrigger>

                  <PopoverContent
                    side="left"
                    className="w-fit"
                  >
                    <ColorPicker
                      setColor={setProjectTitleColor}
                      hideColorTypeBtns
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            { /*
              <div
                className="px-2 my-2"
              >
                <Separator />
              </div>
  
              <div
                className="flex flex-col gap-2"
              >
                <div
                  className="w-full flex flex-col gap-2 px-2"
                >
                  <h3
                    className="text-primary-blue font-semibold"
                  >
                    Descrição
                  </h3>
                </div>
  
                <div
                  className="w-full flex flex-col gap-2 px-2"
                >
                  <h2
                  className="font-medium text-zinc-600"
                  >
                    Cor
                  </h2>
  
                  <Popover>
                    <PopoverTrigger>
                      <div
                        className="flex gap-4 items-center border rounded-md p-1"
                      >
                        <div
                          className="size-7 rounded-md border"
                          style={{ background: projectDescriptionColor }}
                        ></div>
                        <span
                          className="font-medium"
                        >
                          {projectDescriptionColor}
                        </span>
                      </div>
                    </PopoverTrigger>
  
                    <PopoverContent
                      side="left"
                      className="w-fit"
                    >
                      <ColorPicker
                        setColor={setProjectDescriptionColor}
                        hideColorTypeBtns
                      />
                    </PopoverContent>
                  </Popover>
                  
  
                </div>
              </div>
            */ }
          </div>

          <div
            className="flex gap-2 w-full"
          >
            <Button
              className="flex-1"
              onClick={() => {
                // setSelectedFont("Roboto")
                // setColor("rgba(175, 51, 242)")
                // setFirstLayerImageUrl("")
                // setThirdLayerImageUrl("")
              }}
              // disabled={selectedPanelToUpdate !== null}
              variant="destructive"
            >
              Redefinir
            </Button>

            <Modal.Root>
              <Modal.OpenButton>
                <Button
                  className="flex-1"
                  variant="success"
                  disabled={!templateDemonstrationImageUrl}
                  // onClick={onCreateNewTemplate}
                >
                  Criar template
                </Button>
              </Modal.OpenButton>
              <Modal.Container>
                <Modal.Header>
                  <Modal.Title title="Revise os detalhes do template" />
                </Modal.Header>
                <Modal.Content>
                  <div
                    className="flex flex-col gap-2"
                  >
                    <div
                      className="flex flex-col gap-2"
                    >
                      <h3
                        className="text-primary-blue font-medium"
                      >
                        Vínculos
                      </h3>

                      <div>
                        <div
                          className="flex flex-col gap-2"
                        >
                          <div
                            className="flex gap-2 items-center"
                          >
                            <Server
                              size={20}
                            />

                            <h4
                              className="font-semibold"
                            >
                              Modelo:
                            </h4>

                            <div
                              className="flex items-center gap-2"
                            >
                              {
                                advancedPanelsModels
                                  .filter(({ id }) => id === selectedPanelToLinkId)
                                  .map(({ id, background_url, button_url }) => (
                                  <div 
                                    className="relative rounded-md w-20 aspect[800/250] h-8 border"
                                    key={id}
                                  >
                                    <img src={background_url} alt="" className="absolute w-full h-full rounded-md z-1" />
                                    <img src={secondLayerImageUrl} alt="" className="absolute h-full w-2/5 object-cover rounded-md z-[2]" />
                                    <img src={button_url} alt="" className="absolute w-full h-full rounded-md z-[3]" />
                                  </div>
                                ))
                              }
                            </div>
                          </div>

                          {
                            selectedMediasToLink.length > 0 &&
                            <div
                              className="flex gap-2 items-center"
                            >
                              <Play
                                size={20}
                              />

                              <h4
                                className="font-semibold"
                              >
                                Mídias:
                              </h4>

                              <span
                                className="flex items-center gap-2"
                              >
                                {
                                  selectedMediasToLink.map((media, index) => (
                                    <span
                                      key={index}
                                    >
                                      {media === "music" ? <AiOutlineSpotify className="text-green-500" size={25} /> : <AiOutlineYoutube size={25} className="text-red-600" /> }
                                    </span>
                                  ))
                                }
                              </span>
                            </div>
                          }
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex flex-col gap-2"
                    >
                      <h3
                        className="text-primary-blue font-medium"
                      >
                        Background
                      </h3>

                      <div>
                        <div>
                          <div
                            className="flex gap-2 items-center"
                          >
                            {
                              selectedTemplateBackgroundType === "Cor"
                              ? (
                                <Palette 
                                  size={20}
                                />
                              ) : (
                                <Image 
                                  size={20}
                                />
                              )
                            }

                            <h4
                              className="font-semibold"
                            >
                              Tipo:
                            </h4>

                            <span
                              className="flex items-center gap-2"
                            >
                              {selectedTemplateBackgroundType}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div
                            className="flex gap-2 items-center"
                          >
                            {
                              selectedTemplateBackgroundType === "Cor"
                              ? (
                                <Palette 
                                  size={20}
                                />
                              ) : (
                                <Image 
                                  size={20}
                                />
                              )
                            }

                            <h4
                              className="font-semibold"
                            >
                              {selectedTemplateBackgroundType}:
                            </h4>

                            <span
                              className="flex items-center gap-2"
                            >
                              {/* {selectedTemplateBackgroundType === "Cor" ? templateBackgroundColor : ""} */}

                              {
                                selectedTemplateBackgroundType === "Cor"
                                ? (
                                  <>
                                    {templateBackgroundColor}
                                    <div
                                      className="size-7 rounded-md border-2"
                                      style={{ background: templateBackgroundColor }}
                                    ></div>
                                  </>
                                ) : (
                                  <div>
                                    <img className="aspect-[478/375] w-10 rounded-sm" src={templateBackgroundImageUrl} alt="" />
                                  </div>
                                )
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex flex-col gap-2"
                    >
                      <h3
                        className="text-primary-blue font-medium"
                      >
                        Visibilidade
                      </h3>

                      <div>
                        <div
                          className="flex flex-col gap-2"
                        >
                          <div
                            className="flex gap-2 items-center"
                          >
                            <Eye
                              size={20}
                            />

                            <h4
                              className="font-semibold"
                            >
                              Exibido em:
                            </h4>

                            <span
                              className="flex items-center gap-2"
                            >
                              {selectedTemplateVisibilityType}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div
                      className="flex flex-col gap-2"
                    >
                      <h3
                        className="text-primary-blue font-medium"
                      >
                        Capa
                      </h3>

                      <div>
                        <div
                          className="flex flex-col gap-2"
                        >
                          <div
                            className="flex gap-2 items-center"
                          >
                            <Scan
                              size={20}
                            />

                            <h4
                              className="font-semibold"
                            >
                              Modelo:
                            </h4>

                            <span
                              className="flex items-center gap-2"
                            >
                              {selectedTemplateCoverType}
                            </span>
                          </div>
                        </div>

                        {
                          selectedTemplateCoverType === "Com capa" &&
                          <>
                            <div
                              className="flex flex-col gap-2"
                            >
                              <div
                                className="flex gap-2 items-center"
                              >
                                {
                                  selectedCoverFillType === "Cor"
                                  ? (
                                    <Palette 
                                      size={20}
                                    />
                                  ) : (
                                    <Image 
                                      size={20}
                                    />
                                  )
                                }

                                <h4
                                  className="font-semibold"
                                >
                                  Tipo de capa:
                                </h4>

                                <div
                                  className="flex items-center gap-2"
                                >
                                  {
                                    selectedCoverType === "gradient"
                                    ? "Modelo 1"
                                    : (
                                      selectedCoverType === "rounded"
                                      ? "Modelo 2"
                                      : "Modelo 3"
                                    )
                                  }
                                </div>
                              </div>
                            </div>

                            <div
                              className="flex flex-col gap-2"
                            >
                              <div
                                className="flex gap-2 items-center"
                              >
                                {
                                  selectedCoverFillType === "Cor"
                                  ? (
                                    <Palette 
                                      size={20}
                                    />
                                  ) : (
                                    <Image 
                                      size={20}
                                    />
                                  )
                                }

                                <h4
                                  className="font-semibold"
                                >
                                  {selectedCoverFillType}:
                                </h4>

                                <span
                                  className="flex items-center gap-2"
                                >
                                {
                                  selectedCoverFillType === "Cor"
                                  ? (
                                    <>
                                    {projectCoverColor}
                                    <div
                                      className="size-7 rounded-md border-2"
                                      style={{ background: projectCoverColor }}
                                    ></div>
                                    </>
                                  ) : (
                                    <div
                                      className="size-10"
                                    >
                                      <img src={projectCoverImageUrl} className="w-full object-cover rounded-md" alt="" />
                                    </div>
                                  )
                                }
                                </span>
                              </div>
                            </div>
                          </>
                        }
                      </div>
                    </div>

                    <div
                      className="flex flex-col gap-2"
                    >
                      <h3
                        className="text-primary-blue font-medium"
                      >
                        Tipografia
                      </h3>

                      <div>
                        <div>
                          <div
                            className="flex gap-2 items-center"
                          >
                            <Type 
                              size={20}
                            />

                            <h4
                              className="font-semibold"
                            >
                              Fonte:
                            </h4>

                            <span
                              className="flex items-center gap-2"
                              style={{ fontFamily: selectedProjectFont }}
                            >
                              {selectedProjectFont}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div
                            className="flex gap-2 items-center"
                          >
                            <Palette 
                              size={20}
                            />

                            <h4
                              className="font-semibold"
                            >
                              Cor:
                            </h4>

                            <span
                              className="flex items-center gap-2"
                            >
                              {projectTitleColor}
                              <div
                                className="size-7 rounded-md border-2"
                                style={{ background: projectTitleColor }}
                              ></div>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal.Content>
                <Modal.Footer>
                  <div
                    className="flex gap-4"
                  >
                    <Modal.CloseButton>
                      <Button
                        variant="destructive"
                      >
                        Cancelar
                      </Button>
                    </Modal.CloseButton>

                    <Button
                      onClick={onCreateNewTemplate}
                      variant="success"
                    >
                      Prosseguir
                    </Button>
                  </div>
                </Modal.Footer>
              </Modal.Container>
            </Modal.Root>
          </div>
        </div>
      </div>
    </div>
  )
}