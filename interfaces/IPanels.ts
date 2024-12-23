export interface ICreatePanel {
  painel_style: string
  text: string
  painel_title: string
  painel_title_classname: string
  border_rounded: string
  border_color: string
  button_text: string
  productsArray: any[]
  order_id: number
  button_url: string
  button_color: string
  button_classname: string
  arquived: boolean
  arquivedToFalse: string
  arquivedToTrue: string
  text_position: string
  format: string
  project_id: number
  imgUrl: string
  painelUrl: string
  musicUrl: string
  videoUrl: string
  background_url: string
  background_color: string
  template: string
}

export interface IPainel extends ICreatePanel {
  id: number
  updatedAt: string
  createdAt: string
}
