import { Form, Input, InputNumber, Select, Modal, message, DatePicker, TimePicker } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';
import dayjs from 'dayjs';

interface StudySessionFormProps {
	visible: boolean;
	isEdit: boolean;
	initialData?: any;
	subjects: any[];
	onCancel: () => void;
	onSubmit: (data: any) => void;
}

const StudySessionForm: React.FC<StudySessionFormProps> = ({
	visible,
	isEdit,
	initialData,
	subjects,
	onCancel,
	onSubmit,
}) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (isEdit && initialData) {
			form.setFieldsValue({
				subjectId: initialData.subjectId,
				date: dayjs(initialData.date, 'YYYY-MM-DD'),
				startTime: dayjs(initialData.startTime, 'HH:mm'),
				duration: initialData.duration,
				content: initialData.content,
				notes: initialData.notes,
			});
		} else {
			form.resetFields();
		}
	}, [visible, isEdit, initialData, form]);

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			onSubmit({
				...values,
				date: values.date.format('YYYY-MM-DD'),
				startTime: values.startTime.format('HH:mm'),
				id: isEdit ? initialData.id : uuidv4(),
				createdAt: isEdit ? initialData.createdAt : Date.now(),
			});
			form.resetFields();
		} catch (error) {
			message.error('Vui lòng điền đầy đủ thông tin');
		}
	};

	return (
		<Modal
			title={isEdit ? 'Sửa lịch học' : 'Thêm lịch học mới'}
			visible={visible}
			onCancel={onCancel}
			onOk={handleSubmit}
			width={600}
		>
			<Form form={form} layout="vertical">
				<Form.Item
					label="Môn học"
					name="subjectId"
					rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
				>
					<Select placeholder="Chọn môn học">
						{subjects.map((subject) => (
							<Select.Option key={subject.id} value={subject.id}>
								{subject.name}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item
					label="Ngày học"
					name="date"
					rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
				>
					<DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
				</Form.Item>

				<Form.Item
					label="Giờ bắt đầu"
					name="startTime"
					rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
				>
					<TimePicker format="HH:mm" style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label="Thời lượng (phút)"
					name="duration"
					rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}
				>
					<InputNumber min={5} max={480} placeholder="Ví dụ: 60" style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label="Nội dung đã học"
					name="content"
					rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
				>
					<Input.TextArea rows={3} placeholder="Mô tả nội dung học tập" />
				</Form.Item>

				<Form.Item label="Ghi chú" name="notes">
					<Input.TextArea rows={2} placeholder="Ghi chú thêm (tuỳ chọn)" />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default StudySessionForm;
