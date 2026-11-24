const API=import.meta.env.VITE_API_URL||'http://localhost:4000/api';
export const getToken=()=>localStorage.getItem('rawat-in-token');
export async function api(path,options={}){const headers={'Content-Type':'application/json',...(options.headers||{})};const token=getToken();if(token)headers.Authorization=`Bearer ${token}`;const response=await fetch(`${API}${path}`,{...options,headers});if(response.status===204)return null;const body=await response.json().catch(()=>({}));if(!response.ok)throw new Error(body.message||'Request API gagal');return body;}
export const authApi={register:(payload)=>api('/auth/register',{method:'POST',body:JSON.stringify(payload)}),login:(payload)=>api('/auth/login',{method:'POST',body:JSON.stringify(payload)}),me:()=>api('/auth/me')};
export const itemApi={list:()=>api('/items'),create:(item)=>api('/items',{method:'POST',body:JSON.stringify(item)}),update:(id,item)=>api(`/items/${id}`,{method:'PUT',body:JSON.stringify(item)}),remove:(id)=>api(`/items/${id}`,{method:'DELETE'})};
export const historyApi={list:()=>api('/history'),create:(entry)=>api('/history',{method:'POST',body:JSON.stringify(entry)})};
