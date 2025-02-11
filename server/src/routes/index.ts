import express from 'express';
import eventRoutes from './api/eventRoutes';
import userRoutes from './api/userRoutes';

const router = express.Router();

router.use('/events', eventRoutes);
router.use('/users', userRoutes);

export default router;