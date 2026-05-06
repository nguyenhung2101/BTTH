import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Empty, Row, Space, Tag, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import type { RouteComponentProps } from 'react-router-dom';
import { history } from 'umi';
import { formatBlogDate, getBlogAuthor, getBlogPostBySlug, getRelatedPosts, incrementPostViews } from '@/services/blog';
import MarkdownRenderer from '../components/MarkdownRenderer';
import styles from './index.less';

const { Title, Paragraph, Text } = Typography;

type DetailParams = {
	slug: string;
};

export default function BlogPostDetail(props: RouteComponentProps<DetailParams>) {
	const slug = props.match.params.slug;
	const [post, setPost] = useState(() => getBlogPostBySlug(slug));

	useEffect(() => {
		setPost(incrementPostViews(slug) || getBlogPostBySlug(slug));
	}, [slug]);

	const relatedPosts = getRelatedPosts(slug, 3);
	const author = getBlogAuthor();

	if (!post) {
		return (
			<div className={styles.page}>
				<Card bordered={false}>
					<Empty description="Không tìm thấy bài viết" />
					<Button className={styles.backButton} onClick={() => history.push('/blog')}>
						<ArrowLeftOutlined /> Quay lại danh sách
					</Button>
				</Card>
			</div>
		);
	}

	return (
		<div className={styles.page}>
			<Button className={styles.backButton} onClick={() => history.push('/blog')} icon={<ArrowLeftOutlined />}>
				Quay lại danh sách
			</Button>

			<Card bordered={false} className={styles.heroCard}>
				<Row gutter={[24, 24]} align="middle">
					<Col xs={24} lg={14}>
						<Title level={1} className={styles.title}>
							{post.title}
						</Title>
						<Paragraph className={styles.summary}>{post.summary}</Paragraph>
						<Space wrap size={12} className={styles.metaRow}>
							<Space>
								<Avatar src={author.avatar} />
								<Text strong>{post.authorName}</Text>
							</Space>
							<Text type="secondary">{formatBlogDate(post.publishedAt || post.createdAt)}</Text>
							<Text type="secondary">
								<EyeOutlined /> {post.viewCount} lượt xem
							</Text>
						</Space>
						<div className={styles.tagRow}>
							{post.tags.map((tag) => (
								<Tag key={tag} color="blue">
									{tag}
								</Tag>
							))}
						</div>
					</Col>
					<Col xs={24} lg={10}>
						<img className={styles.coverImage} src={post.coverImage} alt={post.title} />
					</Col>
				</Row>
			</Card>

			<Row gutter={[20, 20]} className={styles.contentGrid}>
				<Col xs={24} lg={16}>
					<MarkdownRenderer content={post.content} />
				</Col>
				<Col xs={24} lg={8}>
					<Card bordered={false} className={styles.sidebarCard} title="Tác giả">
						<Space align="start" size={16}>
							<Avatar size={56} src={author.avatar} />
							<div>
								<Title level={4} style={{ marginBottom: 4 }}>
									{author.name}
								</Title>
								<Text type="secondary">{author.role}</Text>
							</div>
						</Space>
						<Paragraph className={styles.authorBio}>{author.bio}</Paragraph>
					</Card>

					<Card bordered={false} className={styles.sidebarCard} title="Bài viết liên quan">
						{relatedPosts.length > 0 ? (
							<Space direction="vertical" size={12} style={{ width: '100%' }}>
								{relatedPosts.map((item) => (
									<Card
										key={item.id}
										hoverable
										size="small"
										className={styles.relatedCard}
										onClick={() => history.push(`/blog/post/${item.slug}`)}
									>
										<Space direction="vertical" size={4}>
											<Text strong>{item.title}</Text>
											<Text type="secondary">{moment(item.createdAt).format('DD/MM/YYYY')}</Text>
										</Space>
									</Card>
								))}
							</Space>
						) : (
							<Empty description="Chưa có bài viết liên quan" />
						)}
					</Card>
				</Col>
			</Row>
		</div>
	);
}
