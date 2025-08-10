import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './app/routes/auth.routes.js';
import userRoutes from './app/routes/user.routes.js';
import jobRoutes from './app/routes/jobs.routes.js';
import feedRoutes from './app/routes/feed.routes.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));  
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000', 'https://rize-os-assignment-740aqlfxo-ayyush1738s-projects.vercel.app', 'rize-os-assignment-neon.vercel.app'],
    credentials: true,
}));

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Server is healthy',
        uptime: process.uptime(),
        timestamp: new Date(),
    });
});


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/feed', feedRoutes);

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`);
})


