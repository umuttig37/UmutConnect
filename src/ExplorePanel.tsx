import { useMemo, useState } from 'react'
import { ArrowRight, MapPin, Search, UsersRound } from 'lucide-react'
import { people, topics } from './data/explore'
import type { Post } from './models'

type ResultFilter = 'all' | 'people' | 'posts' | 'topics'

interface ExplorePanelProps {
  posts: Post[]
  following: string[]
  onFollow: (handle: string) => void
  onOpenPost: (post: Post) => void
}

export function ExplorePanel({ posts, following, onFollow, onOpenPost }: ExplorePanelProps) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<ResultFilter>('all')
  const cleanQuery = query.trim().toLowerCase()

  const matchingPeople = useMemo(() => people.filter(person => `${person.name} ${person.handle} ${person.role} ${person.location}`.toLowerCase().includes(cleanQuery)), [cleanQuery])
  const matchingPosts = useMemo(() => posts.filter(post => `${post.name} ${post.handle} ${post.text}`.toLowerCase().includes(cleanQuery)), [posts, cleanQuery])
  const matchingTopics = useMemo(() => topics.filter(topic => `${topic.name} ${topic.category} ${topic.description}`.toLowerCase().includes(cleanQuery)), [cleanQuery])
  const resultCount = matchingPeople.length + matchingPosts.length + matchingTopics.length

  return <div className="explore-view">
    <label className="explore-search"><Search size={19} /><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Search UmutConnect" />{query && <button onClick={() => setQuery('')}>Clear</button>}</label>
    <div className="explore-filters">{(['all', 'people', 'posts', 'topics'] as ResultFilter[]).map(item => <button className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
    {query && <p className="result-summary">{resultCount} results for “{query}”</p>}

    {(filter === 'all' || filter === 'people') && matchingPeople.length > 0 && <section className="people-results"><header><div><UsersRound size={17} /><h2>People</h2></div>{filter === 'all' && <button onClick={() => setFilter('people')}>View all <ArrowRight size={14} /></button>}</header><div>{matchingPeople.slice(0, filter === 'all' ? 3 : undefined).map(person => <article key={person.id}><span className="avatar" style={{ background: person.color }}>{person.initials}</span><div><strong>{person.name}</strong><span>@{person.handle}</span><small><MapPin size={11} /> {person.location} · {person.role}</small></div><button className={following.includes(person.handle) ? 'following' : ''} onClick={() => onFollow(person.handle)}>{following.includes(person.handle) ? 'Following' : 'Follow'}</button></article>)}</div></section>}

    {(filter === 'all' || filter === 'posts') && matchingPosts.length > 0 && <section className="post-results"><header><h2>Posts</h2>{filter === 'all' && <button onClick={() => setFilter('posts')}>View all <ArrowRight size={14} /></button>}</header><div>{matchingPosts.slice(0, filter === 'all' ? 3 : undefined).map(post => <button onClick={() => onOpenPost(post)} key={post.id}><span className="avatar" style={{ background: post.color }}>{post.name.split(' ').map(part => part[0]).join('')}</span><div><strong>{post.name} <small>@{post.handle}</small></strong><p>{post.text}</p><span>{post.replies} replies · {post.likes} likes</span></div></button>)}</div></section>}

    {(filter === 'all' || filter === 'topics') && matchingTopics.length > 0 && <section className="topic-results"><header><h2>Topics</h2>{filter === 'all' && <button onClick={() => setFilter('topics')}>View all <ArrowRight size={14} /></button>}</header><div>{matchingTopics.slice(0, filter === 'all' ? 4 : undefined).map(topic => <button onClick={() => { setQuery(topic.name); setFilter('posts') }} key={topic.id}><small>{topic.category}</small><strong>{topic.name}</strong><p>{topic.description}</p><span>{topic.posts} posts</span></button>)}</div></section>}

    {resultCount === 0 && <div className="explore-empty"><Search size={26} /><strong>Nothing came up for “{query}”</strong><p>Try a person’s name, a place or a broader topic.</p><button onClick={() => setQuery('')}>Browse everything</button></div>}
  </div>
}
