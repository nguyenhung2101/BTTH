// Workout Types
export type ExerciseType = 'CARDIO' | 'STRENGTH' | 'YOGA' | 'HIIT' | 'OTHER';

export interface WorkoutLog {
	id: string;
	date: string; // YYYY-MM-DD
	exerciseType: ExerciseType;
	duration: number; // minutes
	calories: number;
	notes: string;
	status: 'COMPLETED' | 'MISSED';
}

// Health Metrics Types
export interface HealthMetrics {
	id: string;
	date: string; // YYYY-MM-DD
	weight: number; // kg
	height: number; // cm
	restingHeartRate: number; // bpm
	sleepHours: number; // hours
	bmi?: number; // calculated
	bmiCategory?: BMICategory;
}

export type BMICategory = 'UNDERWEIGHT' | 'NORMAL' | 'OVERWEIGHT' | 'OBESE';

export interface BMIInfo {
	value: number;
	category: BMICategory;
	color: string;
	label: string;
}

// Goal Types
export type GoalType = 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'ENDURANCE' | 'OTHER';
export type GoalStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Goal {
	id: string;
	name: string;
	type: GoalType;
	targetValue: number;
	currentValue: number;
	deadline: string; // YYYY-MM-DD
	status: GoalStatus;
	createdAt: string;
	updatedAt: string;
}

// Exercise Library Types
export type MuscleGroup = 'CHEST' | 'BACK' | 'LEGS' | 'SHOULDERS' | 'ARMS' | 'CORE' | 'FULL_BODY';
export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export interface Exercise {
	id: string;
	name: string;
	muscleGroup: MuscleGroup;
	difficulty: DifficultyLevel;
	description: string;
	instructions: string;
	caloriesPerHour: number;
	createdAt: string;
	updatedAt: string;
}

// Dashboard Statistics
export interface DashboardStats {
	totalWorkoutsThisMonth: number;
	totalCaloriesBurned: number;
	consecutiveDays: number; // streak
	goalCompletionPercentage: number;
}

export interface WeeklyWorkoutData {
	week: string; // e.g., "Week 1"
	workouts: number;
}

export interface WeightTrendData {
	date: string;
	weight: number;
}
