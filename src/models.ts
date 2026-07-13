export interface Post {
  id: number
  name: string
  handle: string
  time: string
  color: string
  text: string
  likes: number
  replies: number
  photo?: boolean
  liked?: boolean
  bookmarked?: boolean
}
