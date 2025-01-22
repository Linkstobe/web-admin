'use client'

import ColorPicker from "@/components/color-picker";
import ImageUploadModal from "@/components/image-upload-modal";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { IPainel } from "@/interfaces/IPanels";
import { handleGetAvailableFontsList } from "@/lib/available-fonts-list";
import { cn } from "@/lib/utils";
import { PainelService } from "@/services/panel.service";
import { Pagination, PaginationItem, Stack } from "@mui/material";
import { Check, ChevronsUpDownIcon, X } from "lucide-react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { usePermission } from "@/hook/use-permission";
import { useToast } from "@/hooks/use-toast";
import ConfirmationModal from "@/components/confirmation-modal";

export default function PanelsLibrary () {
  const { toast } = useToast()
  const { canEdit } = usePermission()

  const projectWithAllAdvancedPanels = 1499
  const creationMessage = "Você está prestes a adicionar um novo modelo de painel. Ele passará a ficar disponível para que os usuários possam utilizá-lo. Deseja continuar?"
  const updateMessage = "Você está prestes a atualizar o estilo desse modelo de painel. Ele passará a exibir o novo estilo disponível para que os usuários possam utilizá-lo. Deseja continuar?"

  const [advancedPanelsModels, setAdvancedPanelsModels] = useState<IPainel[]>([])
  const [initialAdvancedPanelModelsSorting, setInitialAdvancedPanelModelsSorting] = useState<IPainel[]>([])

  const [panelType, setPanelType] = useState<string>("advanced")
  const [color, setColor] = useState<string>("rgba(175, 51, 242)")

  const availableFonts = handleGetAvailableFontsList()
  const [filteredFonts, setFilteredFonts] = useState<typeof availableFonts>(availableFonts)

  const [selectedFont, setSelectedFont] = useState<string>("Roboto")

  const [imageUploadModalIsOpen, setImageUploadModalIsOpen] = useState<boolean>(false)
  const [firstLayerImageUrl, setFirstLayerImageUrl] = useState<string>("")
  const [secondLayerImageUrl, setSecondLayerImageUrl] = useState<string>("https://srv538807.hstgr.cloud/uploads/file-1728842785555-452376818.webp")
  const [thirdLayerImageUrl, setThirdLayerImageUrl] = useState<string>("")
  const [selectedImageLayer, setSelectedImageLayer] = useState<string>("")
  const [selectedPanelToUpdate, setSelectedPanelToUpdate] = useState<number | null>(null)

  const [seeMore, setSeeMore] = useState<boolean>(false)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const fontsPerPage: number = 8

  const paginatedFonts = filteredFonts.slice(
    (currentPage - 1) * fontsPerPage,
    currentPage * fontsPerPage,
  )

  const [advancedPanelsModelsCurrentPage, setAdvancedPanelsModelsCurrentPage] = useState<number>(1)
  const advancedPanelsModelsPerPage = 11

  const paginatedAdvancedPanelsModels = initialAdvancedPanelModelsSorting.slice(
    (advancedPanelsModelsCurrentPage - 1) * advancedPanelsModelsPerPage,
    advancedPanelsModelsCurrentPage * advancedPanelsModelsPerPage
  )

  const onAdvancedPanelsModelsPageChange = (event: any, page: number): void => {
    setAdvancedPanelsModelsCurrentPage(page)
  }

  const handlePageChange = (event: any, page: number): void => {
    setCurrentPage(page)
  }

  const onFilterProject = (value: string): void => {
    if (value.trim() === "") {
      setFilteredFonts(availableFonts) 
      return
    }

    const filteredData = availableFonts.filter(({ name }) =>
      name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredFonts(filteredData)
    setCurrentPage(1)
  }

  const onImageUpload = (imageUrl: string) => {
    switch (selectedImageLayer) {
      case "firstLayer":
        setFirstLayerImageUrl(imageUrl)
        break;
      case "thirdLayer":
        setThirdLayerImageUrl(imageUrl)
        break;
      default:
        break;
    }
  }

  const getCssPropertyValue = (style, property) => {
    const regex = new RegExp(`${property}\\s*:\\s*([^;]+);?`, 'i');
    const match = style.match(regex);
    return match ? match[1].trim() : null;
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
      advancedPanelsModels,
      result.source.index,
      result.destination.index
    )

    //@ts-ignore
    setAdvancedPanelsModels(items)
  }

  const onCreateNewAdvancedPanelModel = async () => {
    try {
      const userCanEdit = canEdit()
      if (!userCanEdit) {
        toast({
          variant: "destructive",
          title: "Erro ao criar novo modelo",
          description: "Você não possui permissão para criar um novo modelo. Entre em contato com o administrador.",
        })
        return
      }

      //@ts-ignore
      await PainelService.createNewPainel({
        productsArray: [{ isModel: true }],
        background_url: firstLayerImageUrl,
        imgUrl: secondLayerImageUrl,
        button_url: thirdLayerImageUrl,
        painel_title: "Adicione um texto para destacar o seu painel",
        order_id: initialAdvancedPanelModelsSorting.length,
        arquived: false,
        project_id: projectWithAllAdvancedPanels,
        painel_title_classname: `font-family: ${selectedFont}; font-size: 20px; color: ${color};`,
        painel_style: "advanced"
      })

      toast({
        variant: "success",
        title: "Painel criado!",
        description: "O painel foi criado com sucesso.",
      });

      await onGetPanelsModels()
    } catch (error) {
      console.log("PanelsLibrary: ", error)
      toast({
        variant: "destructive",
        title: "Erro ao criar novo modelo",
        description: "Ocorreu um erro ao criar o modelo. Tente novamente.",
      })
    }
  }

  const onUpdateAdvancedPanelModel = async () => {
    try {
      const userCanEdit = canEdit()
      if (!userCanEdit) {
        toast({
          variant: "destructive",
          title: "Erro ao atualizar modelo",
          description: "Você não possui permissão para atualizar um modelo. Entre em contato com o administrador."
        })
        return
      }

      //@ts-ignore
      await PainelService.updatePainelById(selectedPanelToUpdate, {
        painel_title_classname: `font-family: ${selectedFont}; font-size: 20px; color: ${color};`,
        background_url: firstLayerImageUrl,
        imgUrl: secondLayerImageUrl,
        button_url: thirdLayerImageUrl,
      })

      toast({
        variant: "success",
        title: "Painel atualizado!",
        description: "O painel foi atulizado com sucesso.",
      })

      await onGetPanelsModels()
    } catch (error) {
      console.log("PanelsLibrary: ", error)
      toast({
        variant: "destructive",
        title: "Erro ao atualizar modelo",
        description: "Ocorreu um erro ao atualizar o modelo. Tente novamente.",
      })
    }
    
  }

  const onGetPanelsModels = async () => {
    try {
      const allAdvancedPanelsModels = await PainelService.getPainelByProjectId(projectWithAllAdvancedPanels)

      const validAdvancedPanelsModels = allAdvancedPanelsModels.filter(({ productsArray }) => !productsArray[0]?.isDeleted)
      const ordenedAdvancedPanelsModels = validAdvancedPanelsModels.sort((a, b) => a.order_id - b.order_id);

      setAdvancedPanelsModels(ordenedAdvancedPanelsModels)
      setInitialAdvancedPanelModelsSorting(ordenedAdvancedPanelsModels)
    } catch (error) {
      console.log("PanelsLibrary: ", error)
    }
  }

  const onDeletePanelModel = async (id: number) => {
    try {
      const userCanEdit = canEdit()
      if (!userCanEdit) {
        toast({
          variant: "destructive",
          title: "Erro ao criar novo modelo",
          description: "Você não possui permissão para criar um novo modelo. Entre em contato com o administrador.",
        })
        return
      }

      //@ts-ignore
      await PainelService.updatePainelById(id, {
        productsArray: [{ isDeleted: true }]
      })

      toast({
        variant: "success",
        title: "Painel excluído!",
        description: "O painel foi excluído com sucesso.",
      });

      await onGetPanelsModels()
    } catch (error) {
      console.log("PanelsLibrary: ", error)
      toast({
        variant: "destructive",
        title: "Erro ao criar novo modelo",
        description: "Ocorreu um erro ao criar o modelo. Tente novamente.",
      })
    }
  }

  const onOrderPanelsModels = async () => {
    try {
      const userCanEdit = canEdit()
      if (!userCanEdit) {
        toast({
          variant: "destructive",
          title: "Erro ao ordenar os painéis",
          description: "Você não possui permissão para ordenar os painéis. Entre em contato com o administrador.",
        })
        return
      }

      await Promise.all(
        advancedPanelsModels.map((panel, index) => {
          //@ts-ignore
          return PainelService.updatePainelById(panel.id, {
            order_id: index
          })
        })
      )

      toast({
        variant: "success",
        title: "Painéis ordenados!",
        description: "Os painéis foram ordenados com sucesso.",
      });

      await onGetPanelsModels()
    } catch (error) {
      console.log("PanelsLibrary: ", error)
      toast({
        variant: "destructive",
        title: "Erro ao ordenar painéis",
        description: "Ocorreu um erro ao ordenar os painéis. Tente novamente.",
      })
    }
  }

  useEffect(() => {
    onGetPanelsModels()
  }, [])
  
  return (
    <div
      className="w-full grid grid-cols-[1fr_30rem] gap-4"
    >
      <div
        className="grid grid-rows-[1fr_2fr] gap-4 p-2 rounded-lg shadow-md bg-white border-2 border-[#164F62]"
        style={{ height: "calc(100vh - 100px)"}}
      >

        <div
          className="shadow-md rounded-lg border-2"
        >

          <div
            className="w-full flex justify-center items-center h-full"
          >
            <div
              className="relative max-w-[36rem] w-full rounded-xl aspect-[800/250] border"
            >
              {
                firstLayerImageUrl &&
                <img src={firstLayerImageUrl} alt="" className="absolute w-full h-full rounded-lg z-1" />
              }
              <img src={secondLayerImageUrl} alt="" className="absolute h-full w-2/5 object-cover rounded-lg z-[2]" />
              {
                thirdLayerImageUrl &&
                <img src={thirdLayerImageUrl} alt="" className="absolute w-full h-full rounded-lg z-[3]" />
              }
              <h3
                className="w-3/5 h-full flex z-[4] absolute right-0 justify-center items-center text-center text-[1.75rem] font-semibold"
                style={{
                  color,
                  fontFamily: selectedFont
                }}
              >
                Adicione um texto para destacar o seu painel
              </h3>
            </div>
          </div>
          
        </div>

        <div
          className="shadow-md p-2 rounded-lg border-2 grid gap-4 grid-cols-[1fr_20rem]"
        >
          <div
            className="rounded-lg border shadow-md gap-4 overflow-auto grid w-full pb-20"
            style={{ height: "calc(100vh - 376px)"}}
          >
            {/* <div className="rounded-lg p-2 flex flex-col gap-4">
              <div
                className="flex flex-col gap-2"
              >
                <h3
                  className="text-primary-blue font-semibold"
                >
                  Painéis Básicos
                </h3>

                <div
                  className="grid grid-cols-4 gap-4 relative"
                >
                  {
                    paginatedAdvancedPanelsModels.map(({ id, background_url, button_url, painel_title_classname }, index) => (
                      <div
                        key={index}
                        className={cn(
                          "relative border-2 p-1 rounded-lg border-dashed cursor-pointer group",
                          selectedPanelToUpdate === id ? "border-fuchsia-600" : ""
                        )}
                        onClick={() => {
                          setFirstLayerImageUrl(background_url)
                          setThirdLayerImageUrl(button_url)
                          setSelectedPanelToUpdate(id)
                          setColor(getCssPropertyValue(painel_title_classname, "color"))
                          setSelectedFont(getCssPropertyValue(painel_title_classname, "font-family"))
                        }}
                      >
                        <div className="relative w-full rounded-xl aspect-[800/250] border">
                          <img src={background_url} alt="" className="absolute w-full h-full rounded-lg z-1" />
                          <img src={secondLayerImageUrl} alt="" className="absolute h-full w-2/5 object-cover rounded-lg z-[2]" />
                          <img src={button_url} alt="" className="absolute w-full h-full rounded-lg z-[3]" />
                        </div>

                        <ConfirmationModal
                          title="Confirmação para exclusão de painel"
                          description="Você está prestes a excluir um modelo de painel. Essa ação é irreversível e o modelo não estará mais disponível para os usuários. Deseja continuar?"
                          onConfirm={() => onDeletePanelModel(id)}
                        >
                          <span
                            className="absolute left-1/2 top-full text-red-600 font-semibold text-sm opacity-0 transform -translate-x-1/2 -translate-y-full group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-500 ease-out z-[4] underline"
                          >
                            Excluir
                          </span>
                        </ConfirmationModal>

                      </div>


                    ))
                  }

                  <div
                    className={cn(
                      "border-2 p-1 rounded-lg border-dashed cursor-pointer",
                      selectedPanelToUpdate === null  ? "border-fuchsia-600" : ""
                    )}
                    onClick={() => {
                      setFirstLayerImageUrl("")
                      setThirdLayerImageUrl("")
                      setSelectedPanelToUpdate(null)
                    }}
                  >
                    <Button
                      className="w-full h-full"
                    >
                      + Adicionar novo
                    </Button>
                  </div>
                </div>
              </div>

              <div
                className="flex justify-end items-center"
              >
                <Stack>
                  <Pagination 
                    count={Math.ceil(initialAdvancedPanelModelsSorting.length / advancedPanelsModelsPerPage)} 
                    page={advancedPanelsModelsCurrentPage}
                    onChange={onAdvancedPanelsModelsPageChange}
                    variant="outlined" 
                    shape="rounded"
                  />
                </Stack>
              </div>
            </div> */}

            <div className="rounded-lg p-2 flex flex-col gap-4">
              <div
                className="flex flex-col gap-2"
              >
                <h3
                  className="text-primary-blue font-semibold"
                >
                  Painéis Avançados
                </h3>

                <div
                  className="grid grid-cols-4 gap-4"
                >
                  {
                    paginatedAdvancedPanelsModels.map(({ id, background_url, button_url, painel_title_classname }, index) => (
                      <div
                        key={index}
                        className={cn(
                          "relative border-2 p-1 rounded-lg border-dashed cursor-pointer group",
                          selectedPanelToUpdate === id  ? "border-fuchsia-600" : ""
                        )}
                        onClick={() => {
                          setFirstLayerImageUrl(background_url)
                          setThirdLayerImageUrl(button_url)
                          setSelectedPanelToUpdate(id)
                          setColor(getCssPropertyValue(painel_title_classname, "color"))
                          setSelectedFont(getCssPropertyValue(painel_title_classname, "font-family"))
                        }}
                      >
                        <div className="relative w-full rounded-xl aspect-[800/250] border">
                          <img src={background_url} alt="" className="absolute w-full h-full rounded-lg z-1" />
                          <img src={secondLayerImageUrl} alt="" className="absolute h-full w-2/5 object-cover rounded-lg z-[2]" />
                          <img src={button_url} alt="" className="absolute w-full h-full rounded-lg z-[3]" />
                        </div>

                        <ConfirmationModal
                          title="Confirmação para exclusão de painel"
                          description="Você está prestes a excluir um modelo de painel. Essa ação é irreversível e o modelo não estará mais disponível para os usuários. Deseja continuar?"
                          onConfirm={() => onDeletePanelModel(id)}
                        >
                          <span
                            className="absolute left-1/2 top-full text-red-600 font-semibold text-sm opacity-0 transform -translate-x-1/2 -translate-y-full group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-500 ease-out z-[4] underline"
                          >
                            Excluir
                          </span>
                        </ConfirmationModal>
                      </div>
                    ))
                  }

                  <div
                    className={cn(
                      "border-2 p-1 rounded-lg border-dashed cursor-pointer",
                      selectedPanelToUpdate === null  ? "border-fuchsia-600" : ""
                    )}
                    onClick={() => {
                      setFirstLayerImageUrl("")
                      setThirdLayerImageUrl("")
                      setSelectedPanelToUpdate(null)
                    }}
                  >
                    <Button
                      className="w-full h-full"
                    >
                      + Adicionar novo
                    </Button>
                  </div>
                </div>
              </div>

              <div
                className="flex justify-end items-center"
              >
                <Stack>
                  <Pagination 
                    count={Math.ceil(initialAdvancedPanelModelsSorting.length / advancedPanelsModelsPerPage)} 
                    page={advancedPanelsModelsCurrentPage}
                    onChange={onAdvancedPanelsModelsPageChange}
                    variant="outlined" 
                    shape="rounded"
                  />
                </Stack>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg p-2 border shadow-md grid grid-rows-[1fr_auto] gap-2"
          >
            <div
              className="overflow-auto"
              style={{ height: "calc(100vh - 450px)"}}
            >
              <h3
                className="font-semibold text-center text-primary-blue"
              >
                Ordem dos painéis
              </h3>
              
              <div
                className="flex flex-col gap-2"
              >
                {/* <div
                  className="flex flex-col gap-2"
                >
                  <h4
                    className="text-primary-blue font-medium"
                  >
                    Básicos
                  </h4>
                  <DragDropContext onDragEnd={onDragEnd}>
                    {Array.from({ length: Math.ceil(advancedPanelsModels.length / 3) }).map((_, rowIndex) => (
                      <Droppable
                        key={`droppable-row-${rowIndex}`}
                        droppableId={`droppable-row-${rowIndex}`}
                        type="list"
                        direction="horizontal"
                      >
                        {(provided) => (
                          <div
                            className="grid grid-cols-3 gap-2 overflow-hidden w-full"
                            style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {advancedPanelsModels
                              .slice(rowIndex * 3, (rowIndex + 1) * 3) // Seleciona os itens da linha atual
                              .map(({ id, background_url, button_url }, index) => (
                                <Draggable
                                  key={id}
                                  draggableId={`advanced-panel-model-${id}`}
                                  index={rowIndex * 3 + index} // Calcula o índice global
                                >
                                  {({ dragHandleProps, draggableProps, innerRef }) => (
                                    <div
                                      className="relative w-full rounded-xl aspect-[800/250] border cursor-pointer"
                                      ref={innerRef}
                                      {...draggableProps}
                                      {...dragHandleProps}
                                    >
                                      <img
                                        src={background_url}
                                        alt=""
                                        className="absolute w-full h-full rounded-lg z-1"
                                      />
                                      <img
                                        src={secondLayerImageUrl}
                                        alt=""
                                        className="absolute h-full w-2/5 object-cover rounded-lg z-[2]"
                                      />
                                      <img
                                        src={button_url}
                                        alt=""
                                        className="absolute w-full h-full rounded-lg z-[3]"
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    ))}
                  </DragDropContext>
                </div> */}

                {/* <Separator /> */}

                <div
                  className="flex flex-col gap-2"
                >
                  <h4
                    className="text-primary-blue font-medium"
                  >
                    Avançados
                  </h4>
                  <DragDropContext onDragEnd={onDragEnd}>
                    {Array.from({ length: Math.ceil(advancedPanelsModels.length / 3) }).map((_, rowIndex) => (
                      <Droppable
                        key={`droppable-row-${rowIndex}`}
                        droppableId={`droppable-row-${rowIndex}`}
                        type="list"
                        direction="horizontal"
                      >
                        {(provided) => (
                          <div
                            className="grid grid-cols-3 gap-2 overflow-hidden w-full"
                            style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {advancedPanelsModels
                              .slice(rowIndex * 3, (rowIndex + 1) * 3) // Seleciona os itens da linha atual
                              .map(({ id, background_url, button_url }, index) => (
                                <Draggable
                                  key={id}
                                  draggableId={`advanced-panel-model-${id}`}
                                  index={rowIndex * 3 + index} // Calcula o índice global
                                >
                                  {({ dragHandleProps, draggableProps, innerRef }) => (
                                    <div
                                      className="relative w-full rounded-xl aspect-[800/250] border cursor-pointer"
                                      ref={innerRef}
                                      {...draggableProps}
                                      {...dragHandleProps}
                                    >
                                      <img
                                        src={background_url}
                                        alt=""
                                        className="absolute w-full h-full rounded-lg z-1"
                                      />
                                      <img
                                        src={secondLayerImageUrl}
                                        alt=""
                                        className="absolute h-full w-2/5 object-cover rounded-lg z-[2]"
                                      />
                                      <img
                                        src={button_url}
                                        alt=""
                                        className="absolute w-full h-full rounded-lg z-[3]"
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    ))}
                  </DragDropContext>
                </div>
              </div>
            </div>

            <Separator />

            <div
              className="flex gap-4"
            >
              <Button
                className="flex-1"
                variant="destructive"
                disabled={advancedPanelsModels === initialAdvancedPanelModelsSorting}
                onClick={() => setAdvancedPanelsModels(initialAdvancedPanelModelsSorting)}
              >
                Reverter
              </Button>
              <Button
                className="flex-1"
                variant="success"
                onClick={onOrderPanelsModels}
                disabled={advancedPanelsModels === initialAdvancedPanelModelsSorting}
              >
                Salvar
              </Button>
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
            className="flex w-full shadow-md border rounded-lg"
          >
            <div
              className="flex flex-col gap-2 w-full rounded-lg px-2 py-4"
            >
              <h3
                className="text-primary-blue font-bold"
              >
                Escolha o tipo do painel
              </h3>

              <ToggleGroup
                type="single"
                variant="outline"
                className="gap-2 w-full border rounded-lg p-3 shadow-md bg-neutral-100"
                value={panelType}
                onValueChange={(value: string) => setPanelType(value)}
              >
                <ToggleGroupItem
                  value="basic"
                  className="flex-1 shadow-md text-[#343434] transition-all duration-500 text-sm rounded-md data-[state=on]:bg-[#164F62] data-[state=on]:text-white data-[state=on]:border-neutral-400 border-transparent"
                >
                  Básico
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="advanced"
                  className="flex-1 shadow-md text-[#343434] transition-all duration-500 text-sm rounded-md data-[state=on]:bg-[#164F62] data-[state=on]:text-white data-[state=on]:border-neutral-400 border-transparent"
                >
                  Avançado
                </ToggleGroupItem>
              </ToggleGroup>

            </div>
          </div>

          <div
            className="flex flex-col gap-2 w-full py-4 shadow-md border rounded-lg overflow-hidden transition-all duration-700"
            style={{ maxHeight: seeMore ? "50rem" : "8rem" }}
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

            <div className=" flex flex-col gap-4 px-2 text-zinc-800 text-sm">
              <p className="text-justify">O painel avançado é criado em um formato de três camadas, sendo cada camada responsável por uma parte essencial da composição:</p>

              <ol className="list-inside list-decimal flex flex-col gap-2">
                <li>
                  <strong>Primeira camada (background):</strong>
                  <ul className="list-disc list-inside pl-6">
                    <li>Essa camada será utilizada como o fundo completo do painel.</li>
                    <li>
                      A imagem deve ter a proporção de <strong>800x250 pixels</strong> para garantir o encaixe perfeito.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Segunda camada (enviada pelo usuário):</strong>
                  <ul className="list-disc pl-10">
                    <li>Dividida em três zonas principais:</li>
                    <ul className="list-disc pl-8">
                      <li>
                        Trata-se da imagem que <strong>será enviada pelo usuário</strong> e exibida como parte principal do painel.
                      </li>
                      <li>
                        Essa camada será <strong>posicionada acima da camada de fundo</strong> e parcialmente <strong>sobreposta pela terceira camada</strong>.
                      </li>
                    </ul>
                  </ul>
                </li>
                <li>
                  <strong>Terceira camada (divisões):</strong>
                  <ul className="list-disc pl-10">
                    <li>Dividida em três zonas principais:</li>
                    <ul className="list-disc pl-8">
                      <li>
                        <strong>Zona à esquerda:</strong> Deve ser <strong>transparente</strong>, permitindo que a imagem enviada pelo usuário fique visível.
                      </li>
                      <li>
                        <strong>Zona de transição:</strong> Uma seção intermediária que cobre uma pequena parte da imagem do usuário, criando um efeito de sobreposição.
                      </li>
                      <li>
                        <strong>Zona restante:</strong> Essa parte será preenchida com o mesmo estilo e elementos visuais da primeira camada (background).
                      </li>
                    </ul>
                  </ul>
                </li>
              </ol>

              <p className="text-justify">
                Além das imagens, o painel avançado terá uma <strong>cor</strong> e um <strong>estilo de fontes</strong> personalizados, que serão utilizados nos textos inseridos no painel, proporcionando consistência visual e estética.
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
                Imagens
              </h3>
            </div>

            <div
              className="w-full flex flex-col gap-2 px-2"
            >
              <h2
              className="font-medium text-zinc-600"
              >
                1° Camada (background)
              </h2>

              <div
                // className="w-full aspect-[800/250]"
              >
                {
                  firstLayerImageUrl 
                  ? (
                    <div
                      className="relative group"
                    >
                      <img 
                        src={firstLayerImageUrl}
                        className="aspect-[800/250] object-cover rounded-md group-hover:brightness-50 transition-all duration-300 w-full"
                        alt="" 
                      />

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            className="absolute top-2 right-2"
                          >
                            <X
                              className="absolute text-white opacity-0 top-1 right-1 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                              size={20}
                              onClick={() => setFirstLayerImageUrl("")}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            Remover imagem
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <ImageUploadModal
                      isOpen={imageUploadModalIsOpen}
                      onUpload={onImageUpload}
                      aspectRatio={800/250}
                    >
                      <Button
                        className="w-full h-full border border-dashed border-[#164F62] rounded-md"
                        variant="ghost"
                        onClick={() => setSelectedImageLayer("firstLayer")}
                      >
                        Adicionar imagem
                      </Button>
                    </ImageUploadModal>
                  )
                }
              </div>
            </div>

            <div
              className="w-full flex flex-col gap-2 px-2"
            >
              <h2
              className="font-medium text-zinc-600"
              >
                3° Camada (divisões)
              </h2>
              
              <div
                // className="w-full aspect-[800/250]"
              >
                {
                  thirdLayerImageUrl 
                  ? (
                    <div
                      className="relative group"
                    >
                      <img 
                        src={thirdLayerImageUrl}
                        alt=""
                        className="aspect-[800/250] object-cover rounded-md group-hover:brightness-50 transition-all duration-300 w-full"
                      />

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            className="absolute top-2 right-2"
                          >
                            <X
                              className="absolute text-white opacity-0 top-1 right-1 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                              size={20}
                              onClick={() => setThirdLayerImageUrl("")}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            Remover imagem
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <ImageUploadModal
                      isOpen={imageUploadModalIsOpen}
                      onUpload={onImageUpload}
                      aspectRatio={800/250}
                    >
                      <Button
                        className="w-full h-full border border-dashed border-[#164F62] rounded-md"
                        variant="ghost"
                        onClick={() => setSelectedImageLayer("thirdLayer")}
                      >
                        Adiconar imagem
                      </Button>
                    </ImageUploadModal>
                  )
                }
              </div>
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
                Tipografia
              </h3>
            </div>

            <div
              className="w-full flex flex-col gap-2 px-2"
            >
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
                    { selectedFont || "Selecione uma fonte..."}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent>
                  <Command>
                    <CommandInput 
                      placeholder="Pesquise por projeto..." 
                      onInput={e => onFilterProject((e.target as HTMLInputElement).value)}
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
                                setSelectedFont(currentValue)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedFont === name ? "opacity-100" : "opacity-0"
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
                            count={Math.ceil(filteredFonts.length / fontsPerPage)} 
                            page={currentPage}
                            onChange={handlePageChange}
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
                      style={{ background: color }}
                    ></div>
                    <span
                      className="font-medium"
                    >
                      {color}
                    </span>
                  </div>
                </PopoverTrigger>

                <PopoverContent
                  side="left"
                  className="w-fit"
                >
                  <ColorPicker
                    setColor={setColor}
                    hideColorTypeBtns
                  />
                </PopoverContent>
              </Popover>
              

            </div>
          </div>

          <div
            className="flex gap-2 w-full"
          >
            <Button
              className="flex-1"
              onClick={() => {
                setSelectedFont("Roboto")
                setColor("rgba(175, 51, 242)")
                setFirstLayerImageUrl("")
                setThirdLayerImageUrl("")
              }}
              disabled={selectedPanelToUpdate !== null}
              variant="destructive"
            >
              Redefinir
            </Button>

            <ConfirmationModal
              title={`"Confirmação de ${!selectedPanelToUpdate ? "criação de novo" : "atualização de" } modelo de painel"`}
              description={!selectedPanelToUpdate ? creationMessage : updateMessage}
              onConfirm={() => {
                if (!selectedPanelToUpdate) {
                  onCreateNewAdvancedPanelModel()
                  return
                }

                onUpdateAdvancedPanelModel()
              }}
            >
              <Button
                className="flex-1"
                variant="success"
                disabled={!firstLayerImageUrl || !thirdLayerImageUrl}
              >
                {!selectedPanelToUpdate ? "Criar painel" : "Atualizar painel"}
              </Button>
            </ConfirmationModal>
          </div>
        </div>
      </div>
    </div>
  )
}