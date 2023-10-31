export type BasicEntity = {
  codigo: string
  nome: string
}
export interface CarSpecificationResponse {
  Valor: string
  Marca: string
  Modelo: string
  AnoModelo: number
}

export interface CarSpecification {
  value: string
  brand: string
  model: string
  year: number
}

export type Brand = BasicEntity

export type Model = BasicEntity

export type Year = BasicEntity