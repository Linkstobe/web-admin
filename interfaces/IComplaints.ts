export interface ICreateComplaint {
  id: number
  type:	string
  name:	string
  email:	string
  comments:	string
  project_id:	number
}

export interface IComplaint extends ICreateComplaint {
  createdAt: string
  updatedAt: string
}

export interface IUpdateComplaint extends Partial<IComplaint> {}