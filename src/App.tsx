import { useEffect, useMemo, useState } from 'react'
import { Bell, Bookmark, Compass, Heart, Home, Mail, MessageCircle, MoreHorizontal, Repeat2, Search, Settings, UserRound } from 'lucide-react'
import './App.css'
import './interactions.css'
import './accessibility.css'
import './branding.css'
import { SocialPanel } from './SocialPanel'

type Post={id:number;name:string;handle:string;time:string;color:string;text:string;likes:number;replies:number;photo?:boolean;liked?:boolean;bookmarked?:boolean}
const seedPosts:Post[]=[
  {id:1,name:'Emilia Laine',handle:'emilialaine',time:'12m',color:'#f6b65a',text:'Finally cleaned up the onboarding flow I have been putting off all week. It is funny how removing two unnecessary steps made the whole thing feel finished.',likes:34,replies:7},
  {id:2,name:'Oskari Niemi',handle:'oskarin',time:'1h',color:'#89a8ff',text:'Walk by the sea, coffee at the usual place and now a few quiet hours for my side project. Not a bad Monday.',likes:21,replies:4,photo:true},
  {id:3,name:'Sara Karjalainen',handle:'sarak',time:'3h',color:'#e88da3',text:'Developers: what is one tiny detail in an app that made you think “someone really cared about this”?',likes:58,replies:19},
]
const nav=[{label:'Home',icon:Home},{label:'Explore',icon:Compass},{label:'Notifications',icon:Bell},{label:'Messages',icon:Mail},{label:'Bookmarks',icon:Bookmark},{label:'Profile',icon:UserRound},{label:'Settings',icon:Settings}]

function App(){
  const [posts,setPosts]=useState<Post[]>(()=>{try{return JSON.parse(localStorage.getItem('umutconnect-posts')||'null')||seedPosts}catch{return seedPosts}})
  const [draft,setDraft]=useState('');const [query,setQuery]=useState('');const [toast,setToast]=useState('');const [following,setFollowing]=useState<string[]>([])
  const [view,setView]=useState('Home')
  useEffect(()=>localStorage.setItem('umutconnect-posts',JSON.stringify(posts)),[posts])
  const visible=useMemo(()=>posts.filter(p=>`${p.name} ${p.handle} ${p.text}`.toLowerCase().includes(query.toLowerCase())),[posts,query])
  const notify=(text:string)=>{setToast(text);window.setTimeout(()=>setToast(''),1600)}
  const update=(id:number,changes:Partial<Post>)=>setPosts(items=>items.map(post=>post.id===id?{...post,...changes}:post))
  const publish=()=>{if(!draft.trim())return;setPosts(items=>[{id:Date.now(),name:'Umut Efe',handle:'umute',time:'now',color:'#b9e678',text:draft.trim(),likes:0,replies:0},...items]);setDraft('');notify('Your post is live')}
  const follow=(handle:string)=>setFollowing(items=>items.includes(handle)?items.filter(i=>i!==handle):[...items,handle])

  return <div className="app">
    <aside className="sidebar"><a className="logo" href="#feed"><span>UC</span><div><strong>UmutConnect</strong><small>Social Media App</small></div></a><nav>{nav.map(({label,icon:Icon})=><button className={view===label?'active':''} key={label} onClick={()=>setView(label)}><Icon size={21}/><span>{label}</span>{label==='Notifications'&&<i>3</i>}</button>)}</nav><button className="invade-button" onClick={()=>{setView('Home');setTimeout(()=>document.querySelector('textarea')?.focus(),0)}}>New post</button><div className="mini-profile"><Avatar initials="UE" color="#b9e678"/><div><strong>Umut Efe</strong><span>@umutefe</span></div><MoreHorizontal size={18}/></div></aside>
    <main id="feed"><header className="feed-header"><div><h1>Home</h1><span>For you</span></div><button aria-label="Feed settings"><Settings size={18}/></button></header>
      <section className="composer"><Avatar initials="UE" color="#b9e678"/><div><textarea aria-label="Create a post" placeholder="Share something with your people…" value={draft} maxLength={280} onChange={e=>setDraft(e.target.value)}/><footer><div className="composer-tools"><button onClick={()=>notify('Photo picker ready')}>Photo</button><button onClick={()=>notify('Polls are coming soon')}>Poll</button></div><span className="character-count">{draft.length}/280</span><button className="small-invade" disabled={!draft.trim()} onClick={publish}>Post</button></footer></div></section>
      <div className="feed-tabs"><button className="active">For you</button><button>Following</button></div>
      {visible.length===0&&<div className="empty-state"><Search/><strong>No invasions found</strong><span>Try a different name or phrase.</span></div>}
      {visible.map(post=><article className="post" key={post.id}><Avatar initials={post.name.split(' ').map(n=>n[0]).join('')} color={post.color}/><div className="post-body"><header><strong>{post.name}</strong><span>@{post.handle} · {post.time}</span><button aria-label="Post options"><MoreHorizontal size={18}/></button></header><p>{post.text}</p>{post.photo&&<div className="post-photo"><span>Late afternoon<br/><strong>Helsinki, Finland</strong></span></div>}<footer><button onClick={()=>{update(post.id,{replies:post.replies+1});notify('Reply added')}}><MessageCircle size={16}/><span>{post.replies}</span></button><button onClick={()=>notify('Post link copied')}><Repeat2 size={17}/><span>Share</span></button><button className={post.liked?'liked':''} onClick={()=>update(post.id,{liked:!post.liked,likes:post.likes+(post.liked?-1:1)})}><Heart size={17} fill={post.liked?'currentColor':'none'}/><span>{post.likes}</span></button><button className={post.bookmarked?'bookmarked':''} onClick={()=>update(post.id,{bookmarked:!post.bookmarked})}><Bookmark size={16} fill={post.bookmarked?'currentColor':'none'}/></button></footer></div></article>)}
    </main>
    <aside className="rightbar"><label className="search"><Search size={17}/><input aria-label="Search UmutConnect" placeholder="Search UmutConnect" value={query} onChange={e=>setQuery(e.target.value)}/></label><section className="panel"><h2>Topics people are talking about</h2>{['Design systems','Learning in public','Helsinki tech'].map((tag,i)=><div className="trend" key={tag}><span>Trending · {i+1}</span><strong>{tag}</strong><small>{12-i*3}.4K posts</small></div>)}</section><section className="panel"><h2>People you may know</h2>{[['elias','EL','Elias Lehto','#d8a9ef'],['venla','VM','Venla Mäki','#74c8bb'],['mikko','MR','Mikko Ranta','#f09972']].map(person=><div className="person" key={person[0]}><Avatar initials={person[1]} color={person[3]}/><div><strong>{person[2]}</strong><span>@{person[0]}</span></div><button className={following.includes(person[0])?'following':''} onClick={()=>follow(person[0])}>{following.includes(person[0])?'Following':'Follow'}</button></div>)}</section><p className="legal">Privacy · Terms · Accessibility · © 2026 UmutConnect</p></aside>
    {view!=='Home'&&<SocialPanel view={view} onClose={()=>setView('Home')}/>} {toast&&<div className="toast" role="status">{toast}</div>}
  </div>
}
function Avatar({initials,color}:{initials:string;color:string}){return <div className="avatar" style={{background:color}}>{initials}</div>}
export default App
