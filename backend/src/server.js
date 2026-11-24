import 'dotenv/config';import express from 'express';import cors from 'cors';import cron from 'node-cron';import webpush from 'web-push';import {pool} from './db.js';import authRoutes from './routes/auth.js';import itemsRoutes from './routes/items.js';import historyRoutes from './routes/history.js';import notificationsRoutes from './routes/notifications.js';import {auth} from './middleware/auth.js';
const app=express();
const allowedOrigins = [
  'http://localhost:5173',
  ...(process.env.CLIENT_ORIGIN || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error('Origin tidak diizinkan oleh CORS'));
  }
}));
app.use(express.json({limit:'1mb'}));app.get('/api/health',async(req,res)=>{try{await pool.query('SELECT 1');res.json({status:'ok',database:'connected'});}catch{res.status(503).json({status:'error',database:'unavailable'});}});app.use('/api/auth',authRoutes);app.use('/api/items',auth,itemsRoutes);app.use('/api/history',auth,historyRoutes);app.use('/api/notifications',auth,notificationsRoutes);
if(process.env.VAPID_PUBLIC_KEY&&process.env.VAPID_PRIVATE_KEY){webpush.setVapidDetails(process.env.VAPID_SUBJECT||'mailto:admin@example.com',process.env.VAPID_PUBLIC_KEY,process.env.VAPID_PRIVATE_KEY);cron.schedule('0 8 * * *',async()=>{try{const {rows}=await pool.query("SELECT i.name,i.next_service,u.name AS owner,p.subscription FROM items i JOIN users u ON u.id=i.user_id JOIN push_subscriptions p ON p.user_id=u.id WHERE i.next_service=CURRENT_DATE OR i.next_service=CURRENT_DATE+1");for(const row of rows){const days=row.next_service.toISOString().slice(0,10)===new Date().toISOString().slice(0,10)?'hari ini':'besok';try{await webpush.sendNotification(row.subscription,JSON.stringify({title:'Pengingat Rawat.in',body:`${row.name} memiliki jadwal perawatan ${days}.`}));}catch(err){if(err.statusCode===404||err.statusCode===410)await pool.query('DELETE FROM push_subscriptions WHERE endpoint=$1',[row.subscription.endpoint]);}}}catch(e){console.error('Notification job failed:',e);}});}
app.use((err,req,res,next)=>{console.error(err);if(err.code==='23505')return res.status(409).json({message:'Data duplikat'});res.status(500).json({message:'Kesalahan server'});});const port = process.env.PORT || 4000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Rawat.in API berjalan pada port ${port}`);
});
