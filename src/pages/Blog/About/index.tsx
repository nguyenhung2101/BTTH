import { Avatar, Card, Col, Row, Space, Tag, Typography, Button } from 'antd';
import { getBlogAuthor } from '@/services/blog';
import styles from './index.less';

const { Title, Paragraph, Text } = Typography;

export default function BlogAbout() {
	const author = getBlogAuthor();

	return (
		<div className={styles.page}>
			<Card bordered={false} className={styles.heroCard}>
				<Row gutter={[24, 24]} align="middle">
					<Col xs={24} md={8} className={styles.avatarCol}>
						<Avatar size={168} src={author.avatar} className={styles.avatar} />
					</Col>
					<Col xs={24} md={16}>
						<Title level={2} className={styles.title}>
							{author.name}
						</Title>
						<Text className={styles.role}>{author.role}</Text>
						<Paragraph className={styles.bio}>{author.bio}</Paragraph>
						<Space wrap size={8}>
							{author.skills.map((skill) => (
								<Tag key={skill} color="blue">
									{skill}
								</Tag>
							))}
						</Space>
					</Col>
				</Row>
			</Card>

			<Row gutter={[20, 20]} className={styles.socialGrid}>
				{author.socialLinks.map((link) => (
					<Col xs={24} md={8} key={link.label}>
						<Card bordered={false} className={styles.socialCard}>
							<Title level={4}>{link.label}</Title>
							<Text type="secondary">{link.url}</Text>
							<div style={{ marginTop: 16 }}>
								<Button type="primary" href={link.url} target="_blank" rel="noreferrer">
									Mở liên kết
								</Button>
							</div>
						</Card>
					</Col>
				))}
			</Row>
		</div>
	);
}
