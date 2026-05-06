import { Request, Response } from 'express';
import {
	generateMockWorkouts,
	generateMockHealthMetrics,
	generateMockGoals,
	generateMockExercises,
	generateDashboardStats,
	generateWeeklyWorkoutData,
	generateWeightTrendData,
} from './fitness';
import type { WorkoutLog, HealthMetrics, Goal, Exercise } from '@/models/fitness';

const waitTime = (time: number = 100) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, time);
	});
};

// In-memory storage
let workouts: WorkoutLog[] = generateMockWorkouts();
let healthMetrics: HealthMetrics[] = generateMockHealthMetrics();
let goals: Goal[] = generateMockGoals();
let exercises: Exercise[] = generateMockExercises();

// Helper to generate ID
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default {
	// ============= WORKOUT LOGS =============
	'GET /api/workouts': async (req: Request, res: Response) => {
		await waitTime(300);
		const { startDate, endDate, exerciseType } = req.query;

		let filtered = [...workouts];

		if (startDate) {
			filtered = filtered.filter((w) => w.date >= startDate);
		}
		if (endDate) {
			filtered = filtered.filter((w) => w.date <= endDate);
		}
		if (exerciseType) {
			filtered = filtered.filter((w) => w.exerciseType === exerciseType);
		}

		res.json(filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
	},

	'POST /api/workouts': async (req: Request, res: Response) => {
		await waitTime(300);
		const newWorkout: WorkoutLog = {
			id: generateId('W'),
			...req.body,
		};
		workouts.push(newWorkout);
		res.json(newWorkout);
	},

	'PUT /api/workouts/:id': async (req: Request, res: Response) => {
		await waitTime(300);
		const { id } = req.params;
		const index = workouts.findIndex((w) => w.id === id);
		if (index > -1) {
			workouts[index] = { ...workouts[index], ...req.body };
			res.json(workouts[index]);
		} else {
			res.status(404).json({ error: 'Not found' });
		}
	},

	'DELETE /api/workouts/:id': async (req: Request, res: Response) => {
		await waitTime(300);
		const { id } = req.params;
		workouts = workouts.filter((w) => w.id !== id);
		res.json({ success: true });
	},

	// ============= HEALTH METRICS =============
	'GET /api/health-metrics': async (req: Request, res: Response) => {
		await waitTime(300);
		const { startDate, endDate } = req.query;

		let filtered = [...healthMetrics];

		if (startDate) {
			filtered = filtered.filter((m) => m.date >= startDate);
		}
		if (endDate) {
			filtered = filtered.filter((m) => m.date <= endDate);
		}

		res.json(filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
	},

	'POST /api/health-metrics': async (req: Request, res: Response) => {
		await waitTime(300);
		const newMetric: HealthMetrics = {
			id: generateId('HM'),
			...req.body,
		};
		healthMetrics.push(newMetric);
		res.json(newMetric);
	},

	'PUT /api/health-metrics/:id': async (req: Request, res: Response) => {
		await waitTime(300);
		const { id } = req.params;
		const index = healthMetrics.findIndex((m) => m.id === id);
		if (index > -1) {
			healthMetrics[index] = { ...healthMetrics[index], ...req.body };
			res.json(healthMetrics[index]);
		} else {
			res.status(404).json({ error: 'Not found' });
		}
	},

	'DELETE /api/health-metrics/:id': async (req: Request, res: Response) => {
		await waitTime(300);
		const { id } = req.params;
		healthMetrics = healthMetrics.filter((m) => m.id !== id);
		res.json({ success: true });
	},

	// ============= GOALS =============
	'GET /api/goals': async (req: Request, res: Response) => {
		await waitTime(300);
		const { status } = req.query;

		let filtered = [...goals];

		if (status) {
			filtered = filtered.filter((g) => g.status === status);
		}

		res.json(filtered);
	},

	'POST /api/goals': async (req: Request, res: Response) => {
		await waitTime(300);
		const newGoal: Goal = {
			id: generateId('G'),
			createdAt: new Date().toISOString().split('T')[0],
			updatedAt: new Date().toISOString().split('T')[0],
			...req.body,
		};
		goals.push(newGoal);
		res.json(newGoal);
	},

	'PUT /api/goals/:id': async (req: Request, res: Response) => {
		await waitTime(300);
		const { id } = req.params;
		const index = goals.findIndex((g) => g.id === id);
		if (index > -1) {
			goals[index] = {
				...goals[index],
				...req.body,
				updatedAt: new Date().toISOString().split('T')[0],
			};
			res.json(goals[index]);
		} else {
			res.status(404).json({ error: 'Not found' });
		}
	},

	'DELETE /api/goals/:id': async (req: Request, res: Response) => {
		await waitTime(300);
		const { id } = req.params;
		goals = goals.filter((g) => g.id !== id);
		res.json({ success: true });
	},

	// ============= EXERCISES =============
	'GET /api/exercises': async (req: Request, res: Response) => {
		await waitTime(300);
		const { muscleGroup, difficulty } = req.query;

		let filtered = [...exercises];

		if (muscleGroup) {
			filtered = filtered.filter((e) => e.muscleGroup === muscleGroup);
		}
		if (difficulty) {
			filtered = filtered.filter((e) => e.difficulty === difficulty);
		}

		res.json(filtered);
	},

	'POST /api/exercises': async (req: Request, res: Response) => {
		await waitTime(300);
		const newExercise: Exercise = {
			id: generateId('E'),
			createdAt: new Date().toISOString().split('T')[0],
			updatedAt: new Date().toISOString().split('T')[0],
			...req.body,
		};
		exercises.push(newExercise);
		res.json(newExercise);
	},

	'PUT /api/exercises/:id': async (req: Request, res: Response) => {
		await waitTime(300);
		const { id } = req.params;
		const index = exercises.findIndex((e) => e.id === id);
		if (index > -1) {
			exercises[index] = {
				...exercises[index],
				...req.body,
				updatedAt: new Date().toISOString().split('T')[0],
			};
			res.json(exercises[index]);
		} else {
			res.status(404).json({ error: 'Not found' });
		}
	},

	'DELETE /api/exercises/:id': async (req: Request, res: Response) => {
		await waitTime(300);
		const { id } = req.params;
		exercises = exercises.filter((e) => e.id !== id);
		res.json({ success: true });
	},

	// ============= DASHBOARD =============
	'GET /api/dashboard/stats': async (req: Request, res: Response) => {
		await waitTime(300);
		res.json(generateDashboardStats());
	},

	'GET /api/dashboard/weekly-workouts': async (req: Request, res: Response) => {
		await waitTime(300);
		res.json(generateWeeklyWorkoutData());
	},

	'GET /api/dashboard/weight-trend': async (req: Request, res: Response) => {
		await waitTime(300);
		res.json(generateWeightTrendData());
	},

	'GET /api/dashboard/recent-workouts': async (req: Request, res: Response) => {
		await waitTime(300);
		const { limit = 5 } = req.query;
		const sorted = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
		res.json(sorted.slice(0, parseInt(limit as string)));
	},
};
