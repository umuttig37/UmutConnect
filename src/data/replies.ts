import type { Reply } from '../models'

export const initialReplies: Reply[] = [
  { id: 1, postId: 1, name: 'Laura Hämäläinen', handle: 'laurah', initials: 'LH', color: '#d7b3e8', text: 'This is exactly it. The best changes often look obvious only after someone has done the hard thinking.', time: '8m', liked: false, likes: 4 },
  { id: 2, postId: 1, name: 'Antti Koski', handle: 'anttik', initials: 'AK', color: '#8fc8bd', text: 'Removing a step is much harder than adding another setting. Nice work.', time: '5m', liked: false, likes: 2 },
  { id: 3, postId: 2, name: 'Emilia Laine', handle: 'emilialaine', initials: 'EL', color: '#f6b65a', text: 'That sounds like a very good Monday.', time: '42m', liked: true, likes: 6 },
]
