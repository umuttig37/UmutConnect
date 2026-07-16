import type { Person, Topic } from '../models'

export const people: Person[] = [
  { id: 'elias', name: 'Elias Lehto', handle: 'elias', initials: 'EL', color: '#d8a9ef', role: 'Frontend developer', location: 'Espoo' },
  { id: 'venla', name: 'Venla Mäki', handle: 'venla', initials: 'VM', color: '#74c8bb', role: 'Product designer', location: 'Helsinki' },
  { id: 'mikko', name: 'Mikko Ranta', handle: 'mikko', initials: 'MR', color: '#f09972', role: 'Indie developer', location: 'Tampere' },
  { id: 'laura', name: 'Laura Hämäläinen', handle: 'laurah', initials: 'LH', color: '#e2bd6b', role: 'UX researcher', location: 'Turku' },
  { id: 'antti', name: 'Antti Koski', handle: 'anttik', initials: 'AK', color: '#86a9d7', role: 'Software engineer', location: 'Oulu' },
]

export const topics: Topic[] = [
  { id: 'design', name: 'Design that lasts', category: 'Design', posts: '5.2K', description: 'Small decisions that make digital products easier to live with.' },
  { id: 'indie', name: 'Indie development', category: 'Development', posts: '8.7K', description: 'Side projects, honest progress updates and lessons from shipping.' },
  { id: 'helsinki', name: 'Life in Helsinki', category: 'Local', posts: '3.4K', description: 'Work, coffee, events and everyday moments around the city.' },
  { id: 'opensource', name: 'Open source', category: 'Development', posts: '12.1K', description: 'Projects, maintainers and useful contributions from the community.' },
  { id: 'product', name: 'Product thinking', category: 'Business', posts: '6.8K', description: 'Practical conversations about building things people need.' },
  { id: 'weekend', name: 'Weekend projects', category: 'Community', posts: '2.9K', description: 'What people make when curiosity chooses the roadmap.' },
]
