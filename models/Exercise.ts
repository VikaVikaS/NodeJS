import { User } from './User';

export interface Exercise {
  id: string;
  description: string;
  duration: number;
  date: string;
}

export interface CreatedExerciseResponse {
  userId: string;
  exerciseId: string;
  duration: number;
  description: string;
  date: string;
}

export interface UserExerciseLog extends User {
  logs: Exercise[];
  count: number;
}
