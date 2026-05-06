import { ArrowRightOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Empty, Input, Pagination, Row, Space, Tag, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { history } from 'umi';
import { formatBlogDate, getBlogStats, getBlogTagStats, getPublishedPosts } from '@/services/blog';
import styles from './index.less';

const { Title, Paragraph, Text } = Typography;

const PAGE_SIZE = 9;

export default function BlogHome() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [activeTag, setActiveTag] = useState<string | null>(null);
	const [current, setCurrent] = useState(1);

	useEffect(() => {
		const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
		return () => window.clearTimeout(timer);
	}, [search]);

	useEffect(() => {
		setCurrent(1);
	}, [debouncedSearch, activeTag]);

	const stats = getBlogStats();
	const tags = getBlogTagStats();
	const filteredPosts = useMemo(() => {
		const keyword = debouncedSearch.toLowerCase();
		return getPublishedPosts().filter((post) => {
			const matchesTag = !activeTag || post.tags.some((tag) => tag.toLowerCase() === activeTag.toLowerCase());
			const matchesKeyword =
				!keyword ||
				post.title.toLowerCase().includes(keyword) ||
				post.summary.toLowerCase().includes(keyword) ||
				post.content.toLowerCase().includes(keyword) ||
				post.authorName.toLowerCase().includes(keyword);
			return matchesTag && matchesKeyword;
		});
	}, [activeTag, debouncedSearch]);

	const total = filteredPosts.length;
	const pagedPosts = filteredPosts.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

	return (
		<div className={styles.page}>
			<Card className={styles.hero} bordered={false}>
				<Row gutter={[24, 24]} align="middle">
					<Col xs={24} lg={16}>
						<Title level={2} className={styles.heroTitle}>
							Blog cá nhân cho người viết đều đặn, đọc nhanh và quản lý dễ
						</Title>
						<Paragraph className={styles.heroText}>
							Trang chủ hiển thị bài viết theo thẻ, hỗ trợ tìm kiếm có debounce, phân trang 9 bài mỗi trang và điều hướng sang bài chi tiết chỉ với một cú nhấp.
						</Paragraph>
						<Space wrap size={12}>
							<Tag color="blue">{stats.totalPosts} bài đã đăng</Tag>
							<Tag color="gold">{stats.totalTags} thẻ tag</Tag>
							<Tag color="green">{stats.totalViews} lượt xem</Tag>
						</Space>
					</Col>
					<Col xs={24} lg={8}>
						<div className={styles.heroPanel}>
							<Text className={styles.heroPanelLabel}>Tác giả</Text>
							<Title level={4} style={{ marginTop: 8, marginBottom: 0 }}>
								Nguyễn Minh Khoa
							</Title>
							<Text type="secondary">Viết đều - quản lý gọn - chia sẻ thật</Text>
						</div>
					</Col>
				</Row>
			</Card>

			<Card className={styles.toolbar} bordered={false}>
				<Row gutter={[16, 16]} align="middle">
					<Col xs={24} md={12}>
						<Input
							allowClear
							size="large"
							prefix={<SearchOutlined />}
							placeholder="Tìm kiếm theo từ khóa, tác giả hoặc nội dung..."
							value={search}
							onChange={(event) => setSearch(event.target.value)}
						/>
					</Col>
					<Col xs={24} md={12}>
						<Space wrap className={styles.tagFilters}>
							<Tag.CheckableTag checked={!activeTag} onChange={() => setActiveTag(null)}>
								Tất cả
							</Tag.CheckableTag>
							{tags.map((tag) => (
								<Tag.CheckableTag
									key={tag.id}
									checked={activeTag === tag.name}
									onChange={(checked) => setActiveTag(checked ? tag.name : null)}
								>
									{tag.name} ({tag.postCount})
								</Tag.CheckableTag>
							))}
						</Space>
					</Col>
				</Row>
			</Card>

			<Row gutter={[20, 20]}>
				{pagedPosts.length > 0 ? (
					pagedPosts.map((post) => (
						<Col xs={24} md={12} xl={8} key={post.id}>
							<Card
								hoverable
								className={styles.postCard}
								cover={<img alt={post.title} src={post.coverImage} className={styles.coverImage} />}
								onClick={() => history.push(`/blog/post/${post.slug}`)}
							>
								<Space direction="vertical" size={12} style={{ width: '100%' }}>
									<Space align="start" size={12}>
										<Avatar size={42}>{post.authorName.charAt(0)}</Avatar>
										<div>
											<Title level={4} className={styles.postTitle}>
												{post.title}
											</Title>
											<Text type="secondary">{post.authorName}</Text>
										</div>
									</Space>
									<Paragraph className={styles.postSummary}>{post.summary}</Paragraph>
									<Space wrap size={8}>
										{post.tags.map((tag) => (
											<Tag
												key={tag}
												color={activeTag === tag ? 'blue' : 'default'}
												onClick={(event) => {
													event.stopPropagation();
													setActiveTag(tag);
												}}
												style={{ cursor: 'pointer' }}
											>
												{tag}
											</Tag>
										))}
									</Space>
									<Space className={styles.postMeta}>
										<Text type="secondary">{formatBlogDate(post.publishedAt || post.createdAt)}</Text>
										<Text type="secondary">{post.viewCount} lượt xem</Text>
									</Space>
								</Space>
								<Button type="link" className={styles.readMore}>
									Đọc bài viết <ArrowRightOutlined />
								</Button>
							</Card>
						</Col>
					))
				) : (
					<Col span={24}>
						<Card bordered={false}>
							<Empty description="Không tìm thấy bài viết phù hợp" />
						</Card>
					</Col>
				)}
			</Row>

			<div className={styles.paginationWrap}>
				<Pagination
					current={current}
					pageSize={PAGE_SIZE}
					total={total}
					onChange={setCurrent}
					showSizeChanger={false}
					showTotal={(value, range) => `${range[0]}-${range[1]} / ${value} bài viết`}
				/>
			</div>
		</div>
	);
}
