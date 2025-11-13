import { ReactNode } from 'react';

export enum Sender {
  User = 'user',
  AI = 'ai',
}

export interface Macros {
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
}

export interface Recipe {
  recipeName: string;
  description: string;
  cuisine: string;
  ingredients: string[];
  preparationSteps: string[];
  imagePrompt: string;
  healthTags?: HealthCondition[];
  macros?: Macros;
}

export interface AiResponse {
  recipe?: Recipe;
  chat?: { message: string };
  healthTips?: string[];
}

export interface ChatMessage {
  id: string;
  sender: Sender;
  content: ReactNode;
  recipe?: Recipe;
  healthTips?: string[];
}

export enum Cuisine {
  Moroccan = 'مغربية',
  Mediterranean = 'متوسطية',
  International = 'عالمية',
}

export enum Mood {
  Happy = 'فرحان',
  Lazy = 'كسلان',
  Stressed = 'متوتر',
  Healthy = 'صحي',
  Celebratory = 'احتفالي',
}

export enum HealthCondition {
    Diabetes = 'داء السكري',
    HighBloodPressure = 'ارتفاع الضغط',
    Cholesterol = 'الكوليسترول',
    Anemia = 'فقر الدم',
    HeartIssues = 'مشاكل القلب',
}

export enum FitnessGoal {
    BuildMuscle = 'بناء العضلات',
    LoseWeight = 'تخسيس الوزن',
    MaintainWeight = 'المحافظة على الوزن',
}

export interface FitnessProfile {
    gender: 'male' | 'female' | 'any';
    weight: number;
    height: number;
    activityLevel: 'low' | 'medium' | 'high' | 'any';
}