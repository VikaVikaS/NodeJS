import express from 'express';
import { getAllUsers, createNewUser } from './controllers/userController';
import { createNewExercise, getLogs } from './controllers/exercisesController';

const router = express.Router();

router.get('/api/users', getAllUsers);
router.post('/api/users', createNewUser);

router.post('/api/users/:_id/exercises', createNewExercise);

router.get('/api/users/:_id/logs', getLogs);

router.get('/', (req: express.Request, res: express.Response) => {
  res.sendFile(__dirname + '/views/index.html');
});

export default router;
