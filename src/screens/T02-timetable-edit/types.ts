export interface Lesson {
  id: string;
  subject: string;
  className: string;
  teacher: string;
  room: string;
  day: string;
  hour: number;
  color?: string;
}

export interface ConflictError {
  hasConflict: boolean;
  message: string;
}