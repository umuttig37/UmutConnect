import type { Conversation } from '../models'

export const startingConversations: Conversation[] = [
  {
    id: 'emilia',
    name: 'Emilia Laine',
    handle: 'emilialaine',
    initials: 'EL',
    color: '#f6b65a',
    unread: 2,
    messages: [
      { id: 1, sender: 'them', text: 'Hey! I had a look at the new profile page.', sentAt: '14:28' },
      { id: 2, sender: 'me', text: 'Nice, what did you think?', sentAt: '14:31' },
      { id: 3, sender: 'them', text: 'It feels much clearer now. The short bio makes the page feel personal without being too busy.', sentAt: '14:34' },
      { id: 4, sender: 'them', text: 'The conversation view is a good addition too.', sentAt: '14:35' },
    ],
  },
  {
    id: 'oskari',
    name: 'Oskari Niemi',
    handle: 'oskarin',
    initials: 'ON',
    color: '#74c8bb',
    unread: 0,
    messages: [
      { id: 1, sender: 'me', text: 'Are you free to compare project notes tomorrow?', sentAt: 'Yesterday' },
      { id: 2, sender: 'them', text: 'Sure. I should be around after four.', sentAt: 'Yesterday' },
    ],
  },
  {
    id: 'sara',
    name: 'Sara Karjalainen',
    handle: 'sarak',
    initials: 'SK',
    color: '#e88da3',
    unread: 1,
    messages: [
      { id: 1, sender: 'them', text: 'This reminded me of the discussion we had last week.', sentAt: 'Monday' },
    ],
  },
]
