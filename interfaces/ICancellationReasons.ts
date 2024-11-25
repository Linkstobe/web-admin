export interface ICancellationReason extends ICreateCancellationReason {
  createdAt: string
  updatedAt: string
}

export interface ICreateCancellationReason {
  name: string
  description: string
  project_id: string | number
}