import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Empty } from 'antd';

interface WeeklyChartProps {
	data: Array<{ week: string; workouts: number }>;
}

export default function WeeklyChart({ data }: WeeklyChartProps) {
	if (!data || data.length === 0) {
		return <Empty description="Chưa có dữ liệu" />;
	}

	return (
		<ResponsiveContainer width="100%" height={300}>
			<BarChart data={data}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="week" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Bar dataKey="workouts" fill="#1890ff" name="Số buổi tập" />
			</BarChart>
		</ResponsiveContainer>
	);
}
