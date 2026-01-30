
export enum Role {
  Admin,
  Student,
}

export interface Meal {
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
}

export interface DietPlan {
  monday: Meal;
  tuesday: Meal;
  wednesday: Meal;
  thursday: Meal;
  friday: Meal;
  saturday: Meal;
}

export interface WorkoutPlan {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
}

export interface ProgressPhoto {
  id: string;
  date: string; // ISO string
  imageDataUrl: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  role: Role;
  fullName: string;
  expirationDate: string; // YYYY-MM-DD
  workoutPlan: WorkoutPlan;
  dietPlan: DietPlan;
  progressPhotos: ProgressPhoto[];
}

export const WEEK_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
export type WeekDay = typeof WEEK_DAYS[number];

export const MEAL_TIMES = ['breakfast', 'lunch', 'snack', 'dinner'] as const;
export type MealTime = typeof MEAL_TIMES[number];
