import { Form, Input, Select, Modal, message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';

const colors = [
	'#FF6B6B',
	'#4ECDC4',
	'#45B7D1',
	'#FFA07A',
	'#98D8C8',
	'#F7DC6F',
	'#BB8FCE',
	'#85C1E2',
];

interface SubjectFormProps {
	visible: boolean;
	isEdit: boolean;
	initialData?: any;
	onCancel: () => void;
	onSubmit: (data: any) => void;
}

const SubjectForm: React.FC<SubjectFormProps> = ({
	visible,
	isEdit,
	initialData,
	onCancel,
	onSubmit,
}) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (isEdit && initialData) {
			form.setFieldsValue(initialData);
		} else {
			form.resetFields();
		}
	}, [visible, isEdit, initialData, form]);

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			onSubmit({
				...values,
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
			title={isEdit ? 'Sửa môn học' : 'Thêm môn học mới'}
			visible={visible}
			onCancel={onCancel}
			onOk={handleSubmit}
		>
			<Form form={form} layout="vertical">
				<Form.Item
					label="Tên môn học"
					name="name"
					rules={[{ required: true, message: 'Vui lòng nhập tên môn học' }]}
				>
					<Input placeholder="Ví dụ: Toán học" />
				</Form.Item>

				<Form.Item
					label="Màu sắc"
					name="color"
					initialValue={colors[0]}
					rules={[{ required: true }]}
				>
					<Select>
						{colors.map((color) => (
							<Select.Option key={color} value={color}>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<div
										style={{
											width: '20px',
											height: '20px',
											backgroundColor: color,
											borderRadius: '4px',
											marginRight: '8px',
										}}
									/>
									{color}
								</div>
							</Select.Option>
						))}
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default SubjectForm;
