export namespace QuanLyHocTap {
	export interface Subject {
		id: string;
		name: string;
		color: string;
		createdAt: number;
	}

	export interface StudySession {
		id: string;
		subjectId: string;
		date: string;
		startTime: string;
		duration: number; // phút
		content: string;
		notes: string;
		createdAt: number;
	}

	export interface MonthlyGoal {
		id: string;
		month: string; // YYYY-MM
		goals: {
			subjectId?: string;
			targetHours: number;
		}[];
		createdAt: number;
	}
}

export default {
	namespace: 'quanlyhocsap',
	state: {
		subjects: [] as QuanLyHocTap.Subject[],
		sessions: [] as QuanLyHocTap.StudySession[],
		goals: [] as QuanLyHocTap.MonthlyGoal[],
	},
	reducers: {
		setSubjects(state: any, { payload }: any) {
			return {
				...state,
				subjects: payload,
			};
		},
		setSessions(state: any, { payload }: any) {
			return {
				...state,
				sessions: payload,
			};
		},
		setGoals(state: any, { payload }: any) {
			return {
				...state,
				goals: payload,
			};
		},
	},
	effects: {},
	subscriptions: {
		setup({ dispatch }: any) {
			// Load từ localStorage khi app khởi động
			const subjects = localStorage.getItem('hocsap_subjects');
			const sessions = localStorage.getItem('hocsap_sessions');
			const goals = localStorage.getItem('hocsap_goals');

			dispatch({
				type: 'setSubjects',
				payload: subjects ? JSON.parse(subjects) : [],
			});
			dispatch({
				type: 'setSessions',
				payload: sessions ? JSON.parse(sessions) : [],
			});
			dispatch({
				type: 'setGoals',
				payload: goals ? JSON.parse(goals) : [],
			});
		},
	},
};
