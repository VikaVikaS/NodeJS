import { User } from './User';

export interface Exercise {
  id: number;
  description: string;
  duration: number;
  date: string;
}

export interface CreatedExerciseResponse {
  userId: number;
  exerciseId: number;
  duration: number;
  description: string;
  date: string;
}

export interface UserExerciseLog extends User {
  logs: Exercise[];
  count: number;
}
