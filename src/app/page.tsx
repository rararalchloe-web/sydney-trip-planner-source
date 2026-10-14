"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, CalendarDays, Camera, Clock3, Coffee, Footprints, House, MapPin, Shirt, ShoppingBag, Sparkles, Sun, Umbrella, Utensils, Waves } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Age = "20s" | "3040" | "50plus";
type Style = "first" | "food" | "nature" | "slow";
type Group = "couple" | "family" | "parents" | "friends" | "solo";

const labels = {
  age: { "20s": "20대", "3040": "30–40대", "50plus": "50대 이상" },
  style: { first: "첫 시드니 · 핵심형", food: "미식 · 카페형", nature: "바다 · 자연형", slow: "느긋한 휴양형" },
  group: { couple: "커플", family: "아이 동반 가족", parents: "부모님과 함께", friends: "친구끼리", solo: "혼자" },
};

const dayPlans = [
  { id:"harbour", eyebrow:"시드니의 첫 장면", title:"서큘러 키 · 오페라하우스 · 더 록스", summary:"왕립식물원에서 시작해 미세스 맥쿼리스 포인트, 오페라하우스, 더 록스를 한 호흡으로 걷는 클래식 코스.", time:"10:00–20:30", walk:"약 12,000보", tags:["first","slow","couple","parents","solo","3040","50plus"], eat:"Bennelong 또는 Opera Bar", tip:"오페라하우스 투어는 오전 회차를 미리 예약하세요.", url:"https://www.sydneyoperahouse.com/tours-and-experiences/sydney-opera-house-tour" },
  { id:"bondi", eyebrow:"태평양을 걷는 날", title:"본다이 · 타마라마 · 브론테", summary:"본다이 아이스버그에서 시작하는 해안 산책. 체력에 따라 브론테에서 멈추거나 쿠지까지 이어갑니다.", time:"09:30–18:00", walk:"약 14,000보", tags:["nature","couple","friends","solo","20s","3040"], eat:"Icebergs 또는 Bills Bondi", tip:"바람이 센 날이 많아 얇은 바람막이를 꼭 챙기세요.", url:"https://www.bonditocoogeewalk.com/" },
  { id:"manly", eyebrow:"페리도 여행이다", title:"맨리 페리 · 셸리 비치", summary:"서큘러 키에서 페리로 항구 전체를 감상하고, 맨리 산책로와 잔잔한 셸리 비치에서 쉬는 날.", time:"10:00–19:00", walk:"약 10,000보", tags:["nature","slow","family","parents","friends","50plus"], eat:"The Pantry Manly", tip:"돌아오는 페리는 해 질 무렵을 노리면 야경 크루즈 부럽지 않아요.", url:"https://transportnsw.info/routes/details/sydney-ferries/f1/090F1" },
  { id:"blue", eyebrow:"도시 밖 하루", title:"블루마운틴 · 루라", summary:"세 자매봉과 유칼립투스 숲을 보고 작은 마을 루라에서 티타임. 투어 또는 기차로 다녀올 수 있어요.", time:"07:30–19:30", walk:"약 9,000보", tags:["nature","first","family","parents","couple","3040","50plus"], eat:"Leura Garage", tip:"시드니 도심보다 서늘합니다. 경량 패딩이나 따뜻한 겉옷을 추가하세요.", url:"https://www.nationalparks.nsw.gov.au/visit-a-park/parks/blue-mountains-national-park" },
  { id:"food", eyebrow:"먹으러 온 게 맞습니다", title:"패딩턴 · 서리힐스 미식 산책", summary:"스페셜티 커피, 독립 숍, 호주식 브런치와 예약해 둔 저녁 한 끼를 여유 있게 잇습니다.", time:"10:30–21:30", walk:"약 8,000보", tags:["food","slow","couple","friends","solo","20s","3040"], eat:"Saint Peter 또는 Firedoor", tip:"인기 레스토랑은 여행 날짜가 정해지는 즉시 예약하는 편이 안전해요.", url:"https://www.saintpeter.com.au/" },
  { id:"zoo", eyebrow:"아이도 어른도 성공", title:"타롱가 동물원 · 모스만", summary:"페리로 이동해 코알라와 캥거루를 만나고, 동물원 너머 하버브리지 전망까지 챙기는 가족 맞춤 코스.", time:"09:00–17:30", walk:"약 11,000보", tags:["family","first","nature","20s","3040"], eat:"동물원 카페 + 모스만", tip:"지도상 위쪽 입구부터 내려오는 동선이 훨씬 수월합니다.", url:"https://taronga.org.au/sydney-zoo/visitor-information" },
  { id:"barangaroo", eyebrow:"새 시드니와 오래된 시드니", title:"바랑가루 · 월시베이 · 밀러스포인트", summary:"해안 산책과 현대 건축, 오래된 부두 창고를 함께 보는 도심 코스. 해 질 무렵 풍경이 특히 좋아요.", time:"11:00–20:00", walk:"약 9,000보", tags:["slow","food","couple","parents","solo","3040","50plus"], eat:"a’Mare 또는 Barangaroo House", tip:"평평한 길이 많아 오래 걷기 부담스러운 날에 좋아요.", url:"https://www.barangaroo.com/" },
];

const dining = {
  first: [["Bennelong","오페라하우스 안에서 먹는 ‘시드니다운 한 끼’","예약 필수 · $$$$","https://www.bennelong.com.au/"],["Cafe Sydney","하버브리지 전망과 모던 호주 요리","창가석 요청 · $$$","https://cafesydney.com/"],["Bills","리코타 핫케이크로 시작하는 호주식 브런치","브런치 · $$","https://www.bills.com.au/"]],
  food: [["Saint Peter","호주 해산물을 가장 세련되게 경험하는 곳","예약 필수 · $$$$","https://www.saintpeter.com.au/"],["Firedoor","불과 호주 식재료에 집중한 코스","예약 필수 · $$$$","https://firedoor.com.au/"],["AP Bakery","루프톱에서 즐기는 사워도우와 페이스트리","아침 · $$","https://apbakery.com.au/"]],
  nature: [["Icebergs Dining Room","본다이 바다를 정면으로 보는 모던 이탈리안","선셋 · $$$$","https://idrb.com/"],["The Pantry Manly","발밑이 모래인 맨리 비치 식사","점심 · $$$","https://www.thepantrymanly.com/"],["Coogee Pavilion","해안 산책 끝에 쉬기 좋은 활기찬 공간","캐주얼 · $$","https://merivale.com/venues/coogeepavilion/"]],
  slow: [["The Grounds of the City","도심에서 천천히 즐기는 아침과 커피","아침 · $$","https://thegrounds.com.au/"],["Opera Bar","예약 부담 없이 즐기는 항구 전망","노을 · $$$","https://www.operabar.com.au/"],["The Tea Room QVB","쇼핑 중 쉬어 가는 애프터눈 티","예약 추천 · $$$","https://thetearoom.com.au/"]],
};

const shops = {
  "20s": [["Mecca 한정 뷰티","호주 뷰티 편집숍에서 현지 브랜드 탐색","Pitt St Mall"],["Aesop","가볍고 실패 적은 향·핸드케어 선물","QVB · The Rocks"],["Haigh’s Chocolates","호주산 초콜릿, 사무실 선물에도 안전","Queen Victoria Building"]],
  "3040": [["Jurlique 스킨케어","호주산 식물 원료로 유명한 실용 선물","David Jones"],["R.M.Williams","오래 신는 부츠와 가죽 소품","George St"],["싱글 오리진 원두","시드니 카페 기억을 집으로 가져가기","Surry Hills 로스터리"]],
  "50plus": [["T2 Tea","가볍고 포장 좋은 티 컬렉션","QVB"],["Lucas’ Papaw Ointment","약국·마트에서 사는 부담 없는 선물","Chemist Warehouse"],["진품 인증 원주민 공예","작가·지역 정보와 인증을 꼭 확인","The Rocks 전문 갤러리"]],
};

const outfits: Record<Age, [string,string,string][]> = {
  "20s": [["도심·카페 날","반팔 또는 얇은 셔츠 + 와이드 팬츠","가벼운 재킷을 어깨에"],["해안 산책 날","기능성 티 + 바람막이 + 운동화","선글라스와 캡"],["저녁 약속","원피스/셔츠 + 블레이저","발 편한 로퍼"]],
  "3040": [["도심·카페 날","스트라이프 셔츠 + 데님","트렌치 또는 얇은 재킷"],["해안 산책 날","흡습 티 + 경량 바람막이","쿠션 좋은 스니커즈"],["저녁 약속","니트나 원피스 + 재킷","작은 크로스백"]],
  "50plus": [["도심·카페 날","얇은 니트 + 편한 팬츠","가벼운 트렌치"],["해안 산책 날","긴팔 기능성 상의 + 방풍 재킷","미끄럼 적은 운동화"],["저녁·블루마운틴","겹쳐 입는 니트","경량 패딩 또는 보온 재킷"]],
};
const outfitImages = [
  { src:"./outfit-city.webp", alt:"스트라이프 셔츠와 데님, 트렌치코트를 입은 시드니 도심 코디" },
  { src:"./outfit-coast.webp", alt:"가벼운 바람막이와 편한 팬츠, 운동화를 매치한 시드니 해안 산책 코디" },
  { src:"./outfit-evening.webp", alt:"네이비 원피스와 블레이저, 로퍼를 매치한 시드니 저녁 코디" },
];
const pace: Record<Group,string> = { couple:"전망 좋은 저녁 2회 · 하루 1번 여유", family:"오후 휴식 확보 · 이동 40분 이내", parents:"계단 최소화 · 전망대 중심", friends:"저녁 일정 강화 · 사진 스폿 추가", solo:"예약 부담 최소 · 걷기 좋은 동선" };

export default function Home() {
  const [age,setAge]=useState<Age>("3040");
  const [style,setStyle]=useState<Style>("first");
  const [group,setGroup]=useState<Group>("couple");
  const plan=useMemo(()=>[...dayPlans].map((x,i)=>({...x,score:(x.tags.includes(style)?7:0)+(x.tags.includes(group)?5:0)+(x.tags.includes(age)?3:0)-i*.01})).sort((a,b)=>b.score-a.score).slice(0,5),[age,style,group]);
  const spend=useMemo(()=>({first:185,food:255,nature:165,slow:175}[style]+({couple:15,family:-10,parents:20,friends:5,solo:25}[group])),[style,group]);
  return <main>
    <header className="topbar"><a className="brand" href="#top"><span className="brand-mark">S</span><span>SYDNEY, YOUR WAY</span></a><a className="top-link" href="#results">내 여행 보기 <ArrowUpRight size={15}/></a></header>
    <section className="hero" id="top"><img src="./sydney-harbour.png" alt="푸른 시드니 항구와 오페라하우스, 하버브리지"/><div className="hero-wash"/><div className="hero-copy"><p className="kicker"><Waves size={16}/> 5박 7일, 취향대로</p><h1>남들 코스 말고,<br/>내 시드니.</h1><p>연령대와 여행 스타일, 동행을 고르면 꼭 볼 곳부터 한 끼, 장바구니, 9월 말 옷차림까지 딱 맞춰 드려요.</p></div></section>
    <section className="planner" aria-label="여행 조건 선택">
      <Choice label="연령대" value={age} onChange={v=>setAge(v as Age)} items={[["20s","20대"],["3040","30–40대"],["50plus","50대 이상"]]}/><i/>
      <Choice label="여행 스타일" value={style} onChange={v=>setStyle(v as Style)} items={[["first","첫 시드니 · 핵심형"],["food","미식 · 카페형"],["nature","바다 · 자연형"],["slow","느긋한 휴양형"]]}/><i/>
      <Choice label="누구와" value={group} onChange={v=>setGroup(v as Group)} items={[["couple","커플"],["family","아이 동반 가족"],["parents","부모님과 함께"],["friends","친구끼리"],["solo","혼자"]]}/>
      <a className="result-button" href="#results">결과 보기 <ArrowUpRight size={18}/></a>
    </section>
    <section className="results" id="results">
      <div className="section-head"><div><p className="kicker dark"><Sparkles size={15}/> 방금 완성된 추천</p><h2>{labels.age[age]} · {labels.group[group]}의<br/><em>{labels.style[style]}</em> 시드니</h2></div><div className="trip-summary"><div><span>추천 리듬</span><strong>{pace[group]}</strong></div><div><span>현지 예상 경비</span><strong>{"1인 약 A$"+spend*5}</strong><small>숙박·항공 제외 / 5일</small></div></div></div>
      <nav className="mini-nav"><a href="#route"><CalendarDays size={17}/>5일 동선</a><a href="#food"><Utensils size={17}/>먹을 곳</a><a href="#shop"><ShoppingBag size={17}/>살 것</a><a href="#wear"><Shirt size={17}/>입을 것</a></nav>
      <SectionTitle no="01" overline="YOUR ROUTE" title="시차까지 생각한 5일"/>
      <div className="days" id="route">{plan.map((x,i)=><article className="day-card" key={x.id}><div className="day-no"><span>DAY</span>{String(i+1).padStart(2,"0")}</div><div className="day-main"><p className="eyebrow">{x.eyebrow}</p><h4>{x.title}</h4><p className="summary">{x.summary}</p><div className="meta"><span><Clock3 size={14}/>{x.time}</span><span><Footprints size={14}/>{x.walk}</span><span><Coffee size={14}/>{x.eat}</span></div><p className="tip"><Sparkles size={14}/>{x.tip}</p></div><a className="official-link" href={x.url} target="_blank" rel="noreferrer"><ArrowUpRight size={17}/></a></article>)}</div>
      <p className="arrival-note"><Camera size={16}/> 도착일은 체크인과 동네 산책, 귀국일은 브런치와 공항 이동만 남겼어요. 여행 욕심도 수하물처럼 무게 제한이 필요하니까요.</p>
      <div className="two-col"><section id="food"><SectionTitle no="02" overline="WHERE TO EAT" title="이 여행에 맞는 세 끼"/><List items={dining[style]} links/></section><section id="shop"><SectionTitle no="03" overline="WHAT TO BRING HOME" title="후회 적은 장바구니"/><List items={shops[age]}/></section></div>
      <section className="wear" id="wear"><div className="wear-intro"><SectionTitle no="04" overline="LATE SEPTEMBER" title="9월 말, 이렇게 입어요"/><p>시드니의 봄은 햇살 아래서는 가볍고, 그늘·아침저녁·페리 위에서는 서늘합니다. 정답은 ‘얇게 여러 겹’이에요.</p><div className="weather-pills"><span><Sun size={16}/>봄 햇빛·강한 UV</span><span><Waves size={16}/>해안 바람</span><span><Umbrella size={16}/>가벼운 비 대비</span></div></div><div className="outfit-cards">{outfits[age].map(([when,look,extra],i)=><article key={when}><div className="outfit-photo"><img src={outfitImages[i].src} alt={outfitImages[i].alt}/><span>LOOK 0{i+1}</span></div><div className="outfit-copy"><h4>{when}</h4><p>{look}</p><small>{extra}</small></div></article>)}</div><p className="outfit-note">사진은 코디의 분위기와 레이어링을 보여주는 예시예요. 가지고 있는 비슷한 옷으로 바꿔 입어도 충분합니다.</p><div className="packline"><strong>캐리어 필수 6</strong><span>얇은 재킷</span><span>바람막이</span><span>쿠션 좋은 운동화</span><span>SPF50+</span><span>선글라스</span><span>접이식 우산</span></div></section>
    </section>
    <section className="before-you-go"><p className="kicker"><Sparkles size={15}/> 예약 전 마지막 체크</p><h2>좋은 여행은 빽빽함보다<br/>‘예약 순서’가 만듭니다.</h2><div className="check-grid"><div><span>1</span><h3>먼저</h3><p>목적형 레스토랑과 블루마운틴 투어</p></div><div><span>2</span><h3>그다음</h3><p>오페라하우스 투어, 타롱가 등 시간 지정 티켓</p></div><div><span>3</span><h3>현지에서</h3><p>날씨를 보고 본다이와 맨리 날짜를 서로 바꾸기</p></div></div><p className="fine-print">운영시간·메뉴·가격과 날씨는 변동될 수 있어 방문 전 공식 사이트와 호주 기상청 예보를 확인하세요. 예상 경비는 교통, 식사, 일반 입장료를 포함한 참고치입니다.</p></section>
    <a className="landing-shortcut" href="#top" aria-label="랜딩페이지로 돌아가기"><House size={17}/><span>처음으로</span></a>
    <footer><span>SYDNEY, YOUR WAY</span><p>5 nights · 7 days · zero copy-paste trips</p><a href="#top">다시 고르기 ↑</a></footer>
  </main>;
}

function Choice({label,value,onChange,items}:{label:string,value:string,onChange:(v:string)=>void,items:string[][]}){return <div className="select-field"><label>{label}</label><Select value={value} onValueChange={onChange}><SelectTrigger className="planner-select"><SelectValue/></SelectTrigger><SelectContent>{items.map(([v,l])=><SelectItem value={v} key={v}>{l}</SelectItem>)}</SelectContent></Select></div>}
function SectionTitle({no,overline,title}:{no:string,overline:string,title:string}){return <div className="section-title"><span>{no}</span><div><p>{overline}</p><h3>{title}</h3></div><a className="section-home" href="#top"><House size={14}/>처음으로</a></div>}
function List({items,links=false}:{items:string[][],links?:boolean}){return <div className="list-cards">{items.map(([name,desc,note,url],i)=>{const inner=<><span className="list-index">0{i+1}</span><div><h4>{name}</h4><p>{desc}</p><small>{!links&&<MapPin size={12}/>} {note}</small></div>{links&&<ArrowUpRight size={17}/>}</>;return links?<a className="list-card" href={url} target="_blank" rel="noreferrer" key={name}>{inner}</a>:<article className="list-card" key={name}>{inner}</article>})}</div>}
