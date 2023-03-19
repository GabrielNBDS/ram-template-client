export interface Paginated<T> {
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    firstPage: number
  }
  data: T[]
}