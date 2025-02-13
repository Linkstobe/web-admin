export interface ICreateTutorialExamples {
  tutorial_title: string
  tutorial_description: string
  tutorial_link_midia: string
  tutorial_reference_page: string
}

export interface ITutorialExamples extends ICreateTutorialExamples {
  id: number
  createdAt: string
  updatedAt: string
}

export interface IUpdateTutorialExamples extends Partial<ICreateTutorialExamples> {}