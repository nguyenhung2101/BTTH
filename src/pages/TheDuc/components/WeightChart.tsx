import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Empty } from 'antd';
import moment from 'moment';

interface WeightChartProps {
	data: Array<{ date: string; weight: number }>;
}

export default function WeightChart({ data }: WeightChartProps) {
	if (!data || data.length === 0) {
		return <Empty description="Chưa có dữ liệu" />;
	}

	// Format data for display
	const formattedData = data.map((d) => ({
		...d,
		displayDate: moment(d.date).format('DD/MM'),
	}));

	return (
		<ResponsiveContainer width="100%" height={300}>
			<LineChart data={formattedData}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="displayDate" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Line type="monotone" dataKey="weight" stroke="#52c41a" name="Cân nặng (kg)" dot={{ r: 4 }} />
			</LineChart>
		</ResponsiveContainer>
	);
}
