import {useEffect,useState} from 'react';import './App.css';import Sidebar from './components/Sidebar';import {authApi,itemApi,historyApi,api} from './utils/api';import {formatDate} from './utils/helpers';
const SESSION='rawat-in-session';const dateOnly=v=>{if(!v)return '';if(/^\d{4}-\d{2}-\d{2}$/.test(String(v)))return String(v);const d=new Date(v);return Number.isNaN(d.getTime())?'':`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};const mapItem=i=>({id:Number(i.id),name:i.name,category:i.category,brand:i.brand||'',nextService:dateOnly(i.next_service??i.nextService),recurrenceMonths:Number(i.recurrence_months||i.recurrenceMonths||0),checklist:Array.isArray(i.checklist)?i.checklist:[]});const mapHistory=h=>({id:Number(h.id),itemId:Number(h.item_id??h.itemId),date:dateOnly(h.date),description:h.description,cost:Number(h.cost||0),nextService:dateOnly(h.next_service??h.nextService)});const today=()=>dateOnly(new Date());function status(d){
  if(!d)return 'Belum dijadwalkan';
  const delta=Math.round((new Date(`${d}T00:00:00`)-new Date(`${today()}T00:00:00`))/86400000);
  if(delta<0)return `Terlambat ${Math.abs(delta)} hari`;
  if(delta===0)return 'Hari ini';
  if(delta===1)return 'Besok · H-1';
  return `${delta} hari lagi`;
}
function money(n){return Number(n||0).toLocaleString('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0})}function nextDate(d,months){const x=new Date(`${d}T00:00:00`);x.setMonth(x.getMonth()+months);return dateOnly(x)}
function Auth({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);

    try {
      const r =
        mode === 'register'
          ? await authApi.register(f)
          : await authApi.login({
              email: f.email,
              password: f.password
            });

      onLogin(r);
    } catch (x) {
      setErr(x.message);
    } finally {
      setBusy(false);
    }
  }

  function changeMode() {
    setMode(mode === 'login' ? 'register' : 'login');
    setErr('');
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">

        <div className="auth-brand">
          <span className="brand-mark">R</span>
          <div>
            <strong>Rawat.in</strong>
            <small>Perawatan barang terorganisasi</small>
          </div>
        </div>

        <div className="auth-intro">
          <p className="eyebrow">PERSONAL CARE TRACKER</p>

          <h1>
            {mode === 'login'
              ? 'Selamat datang kembali!'
              : 'Yuk, mulai Rawat.in!'}
          </h1>

          <p>
            Kelola jadwal dan riwayat perawatan barang
            dalam satu tempat.
          </p>
        </div>

        <form onSubmit={submit} className="auth-form">

          {mode === 'register' && (
            <label>
              Nama lengkap
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                required
                value={f.name}
                onChange={e =>
                  setF({ ...f, name: e.target.value })
                }
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              placeholder="nama@email.com"
              required
              value={f.email}
              onChange={e =>
                setF({ ...f, email: e.target.value })
              }
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Minimal 8 karakter"
              minLength="8"
              required
              value={f.password}
              onChange={e =>
                setF({ ...f, password: e.target.value })
              }
            />
          </label>

          {err && <p className="auth-error">{err}</p>}

          <button
            type="submit"
            disabled={busy}
            className="button button-primary auth-submit"
          >
            {busy
              ? 'Memproses…'
              : mode === 'login'
                ? 'Masuk ke Rawat.in'
                : 'Buat akun'}
          </button>

        </form>

        <p className="auth-switch">
          {mode === 'login'
            ? 'Belum punya akun?'
            : 'Sudah punya akun?'}
          <button type="button" onClick={changeMode}>
            {mode === 'login' ? 'Daftar' : 'Masuk'}
          </button>
        </p>

        <div className="auth-footer">
          <span>♡</span> Small care, lasting comfort.
        </div>

      </section>

      <aside className="auth-side">

        <div className="auth-decoration decor-one"></div>
        <div className="auth-decoration decor-two"></div>
        <div className="auth-decoration decor-three"></div>

        <div className="auth-side-content">

          <span className="auth-side-tag">
            YOUR LITTLE CARE SPACE
          </span>

          <div className="auth-side-art">
            <div className="auth-orbit orbit-one"></div>
            <div className="auth-orbit orbit-two"></div>

            <div className="auth-spark spark-one">✦</div>
            <div className="auth-spark spark-two">✧</div>
            <div className="auth-spark spark-three">✦</div>

            <div className="auth-illustration">
              <span>R</span>
              <div className="illustration-heart">♡</div>
            </div>
          </div>

          <h2>
            Barang terawat,
            <br />
            aktivitas lebih nyaman.
          </h2>

          <p>
            Sedikit perhatian hari ini,
            <br />
            bikin barang lebih awet nanti.
          </p>

          <div className="auth-side-pills">
            <span>♡ Jadwal</span>
            <span>✦ Riwayat</span>
            <span>⌁ Perawatan</span>
          </div>

        </div>

      </aside>

    </main>
  );
}
function Dashboard({data,setTab}){const [month,setMonth]=useState(new Date());const [selectedDate,setSelectedDate]=useState('');const y=month.getFullYear(),m=month.getMonth(),days=new Date(y,m+1,0).getDate(),first=new Date(y,m,1).getDay();const cost=data.history.reduce((a,h)=>a+Number(h.cost||0),0);const monthCost=data.history.filter(h=>{let d=new Date(`${h.date}T00:00:00`);return d.getMonth()===m&&d.getFullYear()===y}).reduce((a,h)=>a+Number(h.cost||0),0);const overdue=data.items.filter(i=>i.nextService&&i.nextService<today()).length;return <section className="page"><div className="welcome-panel"><div><p className="eyebrow light">RAWAT.IN</p><h2>Barang terawat, aktivitas lebih nyaman.</h2><p>Jadwal, checklist, riwayat, dan pengeluaran perawatan dalam satu tempat.</p><button className="button button-white" onClick={()=>setTab('schedule')}>+ Tambah jadwal</button></div><div className="welcome-art">✦</div></div><div className="stats-grid"><Stat label="Total barang" value={data.items.length} icon="▣"/><Stat label="Jadwal terlambat" value={overdue} icon="◷"/><Stat label="Total biaya" value={money(cost)} icon="↗"/></div><div className="dashboard-grid"><div className="content-card"><div className="section-heading"><div><h3>Kalender perawatan</h3><p>Jadwal untuk bulan yang dipilih.</p></div><div className="calendar-nav"><button onClick={()=>setMonth(new Date(y,m-1,1))}>‹</button><strong>{month.toLocaleDateString('id-ID',{month:'long',year:'numeric'})}</strong><button onClick={()=>setMonth(new Date(y,m+1,1))}>›</button></div></div><div className="calendar-grid">{['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map(d=><div className="calendar-head" key={d}>{d}</div>)}{Array.from({length:first},(_,i)=><div key={`blank${i}`} className="calendar-day blank"/>)}{Array.from({length:days},(_,i)=>{let d=`${y}-${String(m+1).padStart(2,'0')}-${String(i+1).padStart(2,'0')}`,ev=data.items.filter(x=>x.nextService===d);return <button type="button" key={d} onClick={()=>setSelectedDate(d)} className={`calendar-day ${d===today()?'current':''}`} style={{textAlign:'left',cursor:'pointer',background:selectedDate===d?'#e8f4ff':''}}><span>{i+1}</span>{ev.map(x=><small key={x.id} title={x.name}>{x.name}</small>)}</button>})}</div>{selectedDate&&<div className="calendar-detail" style={{marginTop:12}}><strong>Detail {formatDate(selectedDate)}</strong>{data.items.filter(x=>x.nextService===selectedDate).map(x=><div key={x.id} className="schedule-row"><div className="schedule-info"><strong>{x.name}</strong><span>{x.category}{x.brand?` · ${x.brand}`:''}</span><small>{status(x.nextService)}</small></div><button className="small-button" onClick={()=>setTab('schedule')}>Lihat jadwal</button></div>)}{!data.items.some(x=>x.nextService===selectedDate)&&<p className="muted">Tidak ada jadwal pada tanggal ini.</p>}</div>}</div><div className="content-card"><h3>Analisis biaya</h3><p className="muted">Biaya tercatat keseluruhan</p><h2>{money(cost)}</h2><div className="cost-highlight"><span>Pengeluaran bulan ini</span><strong>{money(monthCost)}</strong></div><p className="muted">{data.history.length} perawatan tercatat</p><button className="text-button" onClick={()=>setTab('history')}>Lihat riwayat →</button></div></div><div className="content-card"><div className="section-heading"><div><h3>Jadwal terdekat</h3><p>Countdown perawatan barang.</p></div><button className="text-button" onClick={()=>setTab('schedule')}>Lihat semua →</button></div>{data.items.filter(i=>i.nextService).sort((a,b)=>a.nextService.localeCompare(b.nextService)).slice(0,6).map(i=><div className="schedule-row" key={i.id}><div className="date-tile"><span>{i.nextService.slice(8)}</span><small>{i.nextService.slice(5,7)}</small></div><div className="schedule-info"><strong>{i.name}</strong><span>{i.category}</span></div><span className="status-pill upcoming">{status(i.nextService)}</span></div>)}{!data.items.length&&<Empty text="Belum ada barang. Mulai dengan menambahkan jadwal."/>}</div></section>}
function Stat({label,value,icon}){return <div className="stat-card"><div className="stat-icon blue">{icon}</div><div><p>{label}</p><strong>{value}</strong></div></div>}function Empty({text}){return <div className="empty-state"><p>{text}</p></div>}
function Schedule({items,save,onComplete}){const blank={name:'',category:'Elektronik',brand:'',nextService:'',recurrenceMonths:0,checklist:[]};const [f,setF]=useState(blank),[edit,setEdit]=useState(null),[query,setQuery]=useState(''),[filter,setFilter]=useState('all'),[checkText,setCheckText]=useState('');function submit(e){e.preventDefault();save(edit?items.map(i=>i.id===edit?{...i,...f}:i):[...items,{...f,id:Date.now()}]);setF(blank);setEdit(null)}const filtered=items.filter(i=>(i.name+' '+i.category+' '+i.brand).toLowerCase().includes(query.toLowerCase())&&(filter==='none'?!i.nextService:!!i.nextService&&(filter==='all'||filter==='late'&&i.nextService<today()||filter==='upcoming'&&i.nextService>=today()))).sort((a,b)=>(a.nextService||'9999').localeCompare(b.nextService||'9999'));return <section className="page"><div className="page-intro"><h2>Jadwal Perawatan</h2><p>Kelola barang, jadwal, checklist, dan pengulangan perawatan.</p></div><div className="content-card form-card"><h3>{edit?'Edit jadwal':'Tambah barang & jadwal'}</h3><form className="form-grid" onSubmit={submit}><label>Nama barang<input required value={f.name} onChange={e=>setF({...f,name:e.target.value})} placeholder="Contoh: Laptop"/></label><label>Kategori<select value={f.category} onChange={e=>setF({...f,category:e.target.value})}><option>Elektronik</option><option>Kendaraan</option><option>Peralatan rumah</option><option>Lainnya</option></select></label><label>Merek<input value={f.brand} onChange={e=>setF({...f,brand:e.target.value})}/></label><label>Jadwal perawatan<input required type="date" value={f.nextService} onChange={e=>setF({...f,nextService:e.target.value})}/></label><label>Pengulangan<select value={f.recurrenceMonths} onChange={e=>setF({...f,recurrenceMonths:Number(e.target.value)})}><option value="0">Tidak berulang</option><option value="1">Setiap 1 bulan</option><option value="3">Setiap 3 bulan</option><option value="6">Setiap 6 bulan</option><option value="12">Setiap 12 bulan</option></select></label><div className="full-width"><label>Checklist perawatan (opsional)</label><div className="check-add"><input value={checkText} onChange={e=>setCheckText(e.target.value)} placeholder="Tambah langkah checklist"/><button type="button" className="small-button" onClick={()=>{if(checkText.trim())setF({...f,checklist:[...f.checklist,{text:checkText.trim(),done:false}]});setCheckText('')}}>Tambah</button></div>{f.checklist.map((c,i)=><div className="checkline" key={i}><span>{c.text}</span><button type="button" className="small-button danger" onClick={()=>setF({...f,checklist:f.checklist.filter((_,j)=>j!==i)})}>Hapus</button></div>)}</div><div className="form-actions"><button className="button button-primary">{edit?'Simpan perubahan':'Simpan jadwal'}</button>{edit&&<button type="button" className="button button-muted" onClick={()=>{setEdit(null);setF(blank)}}>Batal</button>}</div></form></div><div className="content-card"><div className="section-heading"><h3>Daftar barang & jadwal ({filtered.length})</h3></div><div className="filterbar"><input placeholder="Cari nama, kategori, merek…" value={query} onChange={e=>setQuery(e.target.value)}/><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">Semua status</option><option value="late">Terlambat</option><option value="upcoming">Akan datang</option><option value="none">Tanpa jadwal</option></select></div>{!filtered.length?<Empty text="Tidak ada barang sesuai pencarian/filter."/>:<div className="schedule-list">{filtered.map(i=><div className="schedule-row item-row" key={i.id}><div className="schedule-info"><strong>{i.name}</strong><span>{i.category}{i.brand?` · ${i.brand}`:''}</span><small>{formatDate(i.nextService)} · {status(i.nextService)}{i.recurrenceMonths?` · berulang ${i.recurrenceMonths} bulan`:''}</small>{i.checklist.length>0&&<div className="checklist-display">{i.checklist.map((c,j)=><label key={j}><input type="checkbox" checked={!!c.done} onChange={()=>save(items.map(x=>x.id===i.id?{...x,checklist:x.checklist.map((z,k)=>k===j?{...z,done:!z.done}:z)}:x))}/> {c.text}</label>)}</div>}</div><div className="action-group"><button className="small-button" onClick={()=>{setEdit(i.id);setF({...i,checklist:i.checklist||[]})}}>Edit</button><button className="small-button" onClick={()=>onComplete(i)}>Selesai</button><button className="small-button danger" onClick={()=>{if(confirm(`Hapus ${i.name}?`))save(items.filter(x=>x.id!==i.id))}}>Hapus</button></div></div>)}</div>}</div></section>}
function History({items,history}){const names=new Map(items.map(i=>[i.id,i.name]));return <section className="page"><div className="page-intro"><h2>Riwayat Perawatan</h2><p>Catatan perawatan yang sudah dilakukan beserta biaya.</p></div><div className="content-card"><h3>{history.length} catatan</h3>{!history.length?<Empty text="Belum ada perawatan yang dicatat selesai."/>:<div className="table-wrap"><table><thead><tr><th>Barang</th><th>Tanggal</th><th>Catatan</th><th>Biaya</th></tr></thead><tbody>{history.map(h=><tr key={h.id}><td>{names.get(h.itemId)||'Barang'}</td><td>{formatDate(h.date)}</td><td>{h.description}</td><td>{money(h.cost)}</td></tr>)}</tbody></table></div>}</div><div className="content-card"><h3>Jadwal terlewat</h3>{items.filter(i=>i.nextService&&i.nextService<today()).map(i=><div className="schedule-row" key={i.id}><div className="schedule-info"><strong>{i.name}</strong><span>{formatDate(i.nextService)} · {status(i.nextService)}</span></div></div>)}{!items.some(i=>i.nextService&&i.nextService<today())&&<Empty text="Tidak ada jadwal terlewat."/>}</div></section>}
function Notifications({items}){const t=today(),tomorrow=dateOnly(new Date(Date.now()+86400000));const notices=items.filter(i=>i.nextService&&i.nextService<=tomorrow);return <section className="page"><div className="page-intro"><h2>Notifikasi</h2><p>Pengingat internal dari jadwal perawatan.</p></div><div className="content-card"><h3>{notices.length} pengingat</h3>{notices.map(i=><div className="notification-item" key={i.id}><div><strong>{i.name}</strong><p>{i.nextService<t?'Jadwal terlambat':i.nextService===t?'Jadwal hari ini':'Pengingat H-1'}</p><span>{i.nextService<t?`Jadwal terlewat sejak ${formatDate(i.nextService)}.`:i.nextService===t?`Hari ini jadwal perawatan ${i.name}.`:`Besok jadwal perawatan ${i.name}.`}</span></div><span className="status-pill upcoming">{status(i.nextService)}</span></div>)}{!notices.length&&<Empty text="Tidak ada pengingat hari ini atau besok."/>}</div></section>}
function Profile({user,onSave}){const [f,setF]=useState({name:user.name||'',email:user.email||''}),[msg,setMsg]=useState(''),[pw,setPw]=useState({currentPassword:'',newPassword:'',confirm:''});async function submit(e){e.preventDefault();try{const r=await api('/auth/profile',{method:'PUT',body:JSON.stringify(f)});onSave(r.user);setMsg('Profil diperbarui.')}catch(x){setMsg(x.message)}}async function changePassword(e){e.preventDefault();if(pw.newPassword.length<8){setMsg('Password baru minimal 8 karakter.');return}if(pw.newPassword!==pw.confirm){setMsg('Konfirmasi password tidak cocok.');return}try{const r=await api('/auth/password',{method:'PUT',body:JSON.stringify({currentPassword:pw.currentPassword,newPassword:pw.newPassword})});setMsg(r.message);setPw({currentPassword:'',newPassword:'',confirm:''})}catch(x){setMsg(x.message)}}return <section className="page"><div className="page-intro"><h2>Profil</h2><p>Perbarui informasi akun dan password.</p></div><div className="content-card"><h3>Informasi profil</h3><form className="form-grid" onSubmit={submit}><label>Nama<input required value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></label><label>Email<input type="email" required value={f.email} onChange={e=>setF({...f,email:e.target.value})}/></label><div className="form-actions"><button className="button button-primary">Simpan profil</button></div></form></div><div className="content-card"><h3>Ubah password</h3><form className="form-grid" onSubmit={changePassword}><label>Password lama<input type="password" required value={pw.currentPassword} onChange={e=>setPw({...pw,currentPassword:e.target.value})}/></label><label>Password baru (minimal 8 karakter)<input type="password" minLength="8" required value={pw.newPassword} onChange={e=>setPw({...pw,newPassword:e.target.value})}/></label><label>Konfirmasi password baru<input type="password" required value={pw.confirm} onChange={e=>setPw({...pw,confirm:e.target.value})}/></label><div className="form-actions"><button className="button button-primary">Ubah password</button></div></form>{msg&&<p>{msg}</p>}</div></section>}
export default function App(){const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem(SESSION)||'null')}catch{return null}}),[data,setData]=useState({items:[],history:[]}),[tab,setTab]=useState('dashboard'),[loading,setLoading]=useState(false),[error,setError]=useState('');useEffect(()=>{if(!user)return;let cancelled=false;setLoading(true);Promise.all([itemApi.list(),historyApi.list()]).then(([i,h])=>{if(!cancelled)setData({items:i.map(mapItem),history:h.map(mapHistory)})}).catch(e=>setError(e.message)).finally(()=>setLoading(false));return()=>{cancelled=true}},[user]);function login(r){localStorage.setItem('rawat-in-token',r.token);localStorage.setItem(SESSION,JSON.stringify(r.user));setUser(r.user)}async function saveItems(next){try{for(const n of next){const old=data.items.find(x=>x.id===n.id);if(!old)await itemApi.create(n);else if(JSON.stringify(old)!==JSON.stringify(n))await itemApi.update(n.id,n)}for(const old of data.items)if(!next.some(n=>n.id===old.id))await itemApi.remove(old.id);const fresh=await itemApi.list();setData(d=>({...d,items:fresh.map(mapItem)}))}catch(e){setError(e.message)}}async function complete(item){const cost=prompt(`Biaya perawatan ${item.name} (isi angka, tanpa Rp):`);if(cost===null||cost.trim()===''||!Number.isFinite(Number(cost))||Number(cost)<0){if(cost!==null)alert('Masukkan biaya berupa angka 0 atau lebih.');return}const note=prompt('Catatan perawatan (opsional):')??'';const date=today();const recurring=item.recurrenceMonths>0?nextDate((item.nextService&&item.nextService>date)?item.nextService:date,item.recurrenceMonths):'';try{await historyApi.create({itemId:item.id,date,description:note.trim()||'Perawatan selesai',cost:Number(cost),nextService:recurring});await itemApi.update(item.id,{...item,nextService:recurring,checklist:(item.checklist||[]).map(c=>({...c,done:false}))});const [h,its]=await Promise.all([historyApi.list(),itemApi.list()]);setData({history:h.map(mapHistory),items:its.map(mapItem).map(x=>x.id===item.id&&!recurring?{...x,nextService:''}:x)})}catch(e){setError(e.message)}}function logout(){if(!confirm('Yakin ingin keluar dari Rawat.in?'))return;localStorage.removeItem('rawat-in-token');localStorage.removeItem(SESSION);setUser(null);setData({items:[],history:[]})}function profileSave(u){setUser(u);localStorage.setItem(SESSION,JSON.stringify(u))}if(!user)return <Auth onLogin={login}/>;const titles={dashboard:'Dashboard',schedule:'Jadwal Perawatan',history:'Riwayat',notifications:'Notifikasi',profile:'Profil'};return <div className="app-shell"><Sidebar activeTab={tab} setActiveTab={setTab} count={data.items.filter(i=>i.nextService&&i.nextService<=dateOnly(new Date(Date.now()+86400000))).length}/><main className="main-content"><header className="topbar"><div><p className="eyebrow">PERSONAL CARE TRACKER</p><h1>{titles[tab]}</h1></div><div className="profile"><button type="button" className="avatar profile-button" title="Buka profil" onClick={()=>setTab('profile')}>{user.name?.[0]?.toUpperCase()}</button><button className="small-button" onClick={logout}>Keluar</button></div></header>{loading&&<p>Memuat data…</p>}{error&&<div className="auth-error">{error}<button className="small-button" onClick={()=>setError('')}>Tutup</button></div>}{tab==='dashboard'&&<Dashboard data={data} setTab={setTab}/>} {tab==='schedule'&&<Schedule items={data.items} save={saveItems} onComplete={complete}/>} {tab==='history'&&<History items={data.items} history={data.history}/>} {tab==='notifications'&&<Notifications items={data.items}/>} {tab==='profile'&&<Profile user={user} onSave={profileSave}/>}<footer className="main-footer">Rawat.in · Catat, rawat, dan pantau barangmu.</footer></main></div>}
