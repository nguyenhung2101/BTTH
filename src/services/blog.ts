import moment from 'moment';
import type { BlogAuthor, BlogPost, BlogPostFormValues, BlogPostStatus, BlogTag } from '@/models/blog';

const POSTS_KEY = 'personal-blog-posts';
const TAGS_KEY = 'personal-blog-tags';
const AUTHOR_KEY = 'personal-blog-author';

const isBrowser = typeof window !== 'undefined';

const defaultAuthor: BlogAuthor = {
	name: 'Nguyễn Minh Khoa',
	role: 'Personal Blogger & Frontend Developer',
	avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
	bio:
		'Tôi viết về lập trình web, product thinking, tổ chức công việc và những điều hữu ích để xây dựng một blog cá nhân bền vững.',
	skills: ['React', 'TypeScript', 'UI/UX', 'Markdown', 'System Design', 'Content Strategy'],
	socialLinks: [
		{ label: 'GitHub', url: 'https://github.com/' },
		{ label: 'LinkedIn', url: 'https://www.linkedin.com/' },
		{ label: 'Twitter/X', url: 'https://x.com/' },
	],
};

const seedTags: BlogTag[] = [
	{ id: 'tag-react', name: 'React', description: 'Bài viết về React và hệ sinh thái' },
	{ id: 'tag-typescript', name: 'TypeScript', description: 'Kinh nghiệm TypeScript thực chiến' },
	{ id: 'tag-ux', name: 'UI/UX', description: 'Thiết kế trải nghiệm và giao diện' },
	{ id: 'tag-career', name: 'Career', description: 'Sự nghiệp và phát triển bản thân' },
	{ id: 'tag-productivity', name: 'Productivity', description: 'Tối ưu năng suất cá nhân' },
	{ id: 'tag-writing', name: 'Writing', description: 'Kỹ năng viết và biên tập nội dung' },
	{ id: 'tag-web', name: 'Web Performance', description: 'Tối ưu hiệu năng web' },
];

const seedPosts = (): BlogPost[] => {
	const now = moment();
	const baseCover = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80';
	return [
		{
			id: 'post-1',
			title: 'Bắt đầu blog cá nhân đúng cách',
			slug: 'bat-dau-blog-ca-nhan-dung-cach',
			summary: 'Một roadmap ngắn để bạn xây dựng blog cá nhân có cấu trúc, có nhịp xuất bản và dễ mở rộng.',
			content: `# Bắt đầu blog cá nhân đúng cách

Một blog tốt không cần quá nhiều tính năng ngay từ đầu. Bạn cần một cấu trúc rõ ràng, một giọng văn nhất quán và thói quen xuất bản đều đặn.

## Mục tiêu chính

- Chia sẻ kiến thức
- Ghi lại trải nghiệm
- Tạo dấu ấn cá nhân

> Viết đều quan trọng hơn viết hay ở giai đoạn đầu.

## Checklist tối thiểu

1. Có trang chủ rõ ràng
2. Có trang chi tiết bài viết
3. Có trang giới thiệu tác giả
4. Có khu vực quản lý bài viết và thẻ tag
`,
			coverImage: baseCover,
			tags: ['Writing', 'Career'],
			status: 'PUBLISHED',
			viewCount: 128,
			authorName: defaultAuthor.name,
			createdAt: now.subtract(12, 'day').format('YYYY-MM-DD'),
			updatedAt: now.subtract(11, 'day').format('YYYY-MM-DD'),
			publishedAt: now.subtract(12, 'day').format('YYYY-MM-DD'),
		},
		{
			id: 'post-2',
			title: 'Thiết kế card bài viết đẹp và dễ đọc',
			slug: 'thiet-ke-card-bai-viet-dep-va-de-doc',
			summary: 'Các nguyên tắc bố cục, khoảng trắng và hierarchy giúp card content đọc nhanh hơn trên desktop lẫn mobile.',
			content: `# Thiết kế card bài viết đẹp và dễ đọc

Card là lớp hiển thị đầu tiên của bài viết. Hãy để nó làm tốt nhiệm vụ tóm tắt nội dung mà không gây nhiễu.

## Gợi ý

- Ảnh cover có tỉ lệ thống nhất
- Tiêu đề không quá dài
- Tag chỉ nên là tín hiệu phân loại, không phải trang trí
- Dùng khoảng trắng để tạo nhịp
`,
			coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
			tags: ['UI/UX', 'React'],
			status: 'PUBLISHED',
			viewCount: 96,
			authorName: defaultAuthor.name,
			createdAt: now.subtract(9, 'day').format('YYYY-MM-DD'),
			updatedAt: now.subtract(8, 'day').format('YYYY-MM-DD'),
			publishedAt: now.subtract(9, 'day').format('YYYY-MM-DD'),
		},
		{
			id: 'post-3',
			title: 'Tổ chức nội dung Markdown cho blog',
			slug: 'to-chuc-noi-dung-markdown-cho-blog',
			summary: 'Markdown là định dạng lý tưởng cho blog cá nhân vì dễ viết, dễ lưu trữ và dễ render.',
			content: `# Tổ chức nội dung Markdown cho blog

Markdown cho phép bạn tập trung vào nội dung thay vì định dạng.

## Cấu trúc nên có

- Heading cho các phần lớn
- List cho ý ngắn
- Code block cho ví dụ kỹ thuật
- Link cho tài liệu tham khảo

### Ví dụ code

	slugify('Hello Blog')
`,
			coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
			tags: ['Writing', 'TypeScript'],
			status: 'PUBLISHED',
			viewCount: 74,
			authorName: defaultAuthor.name,
			createdAt: now.subtract(7, 'day').format('YYYY-MM-DD'),
			updatedAt: now.subtract(6, 'day').format('YYYY-MM-DD'),
			publishedAt: now.subtract(7, 'day').format('YYYY-MM-DD'),
		},
		{
			id: 'post-4',
			title: 'Tối ưu tốc độ tải trang blog',
			slug: 'toi-uu-toc-do-tai-trang-blog',
			summary: 'Những bước nhỏ như lazy image, preload font và cache dữ liệu có thể tạo khác biệt lớn.',
			content: `# Tối ưu tốc độ tải trang blog

Một blog nhanh tạo cảm giác chuyên nghiệp và giữ người đọc ở lại lâu hơn.

- Giảm số lượng request
- Dùng ảnh đúng kích thước
- Tránh bundle quá lớn
- Theo dõi Core Web Vitals
`,
			coverImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
			tags: ['Web Performance', 'React'],
			status: 'PUBLISHED',
			viewCount: 65,
			authorName: defaultAuthor.name,
			createdAt: now.subtract(5, 'day').format('YYYY-MM-DD'),
			updatedAt: now.subtract(4, 'day').format('YYYY-MM-DD'),
			publishedAt: now.subtract(5, 'day').format('YYYY-MM-DD'),
		},
		{
			id: 'post-5',
			title: 'Lên kế hoạch nội dung cho 30 ngày',
			slug: 'len-ke-hoach-noi-dung-cho-30-ngay',
			summary: 'Một lịch xuất bản thực tế giúp bạn giữ đều nhịp viết và tránh bị cạn ý tưởng.',
			content: `# Lên kế hoạch nội dung cho 30 ngày

Hãy chia nội dung thành các nhóm nhỏ:

- Bài chia sẻ kinh nghiệm
- Bài hướng dẫn
- Bài ghi chú nhanh
- Bài tổng kết tháng
`,
			coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
			tags: ['Productivity', 'Career'],
			status: 'DRAFT',
			viewCount: 12,
			authorName: defaultAuthor.name,
			createdAt: now.subtract(3, 'day').format('YYYY-MM-DD'),
			updatedAt: now.subtract(2, 'day').format('YYYY-MM-DD'),
		},
		{
			id: 'post-6',
			title: 'Viết bài kỹ thuật không khô khan',
			slug: 'viet-bai-ky-thuat-khong-kho-khan',
			summary: 'Kết hợp trải nghiệm cá nhân, ví dụ thật và giọng văn rõ ràng để giữ độc giả ở lại lâu hơn.',
			content: `# Viết bài kỹ thuật không khô khan

Mỗi bài kỹ thuật nên trả lời 3 câu hỏi:

1. Vấn đề là gì?
2. Tại sao nó quan trọng?
3. Cách xử lý ra sao?

Độc giả sẽ tin bạn hơn khi họ thấy được bối cảnh, không chỉ kết quả.
`,
			coverImage: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
			tags: ['Writing', 'UI/UX'],
			status: 'PUBLISHED',
			viewCount: 41,
			authorName: defaultAuthor.name,
			createdAt: now.subtract(1, 'day').format('YYYY-MM-DD'),
			updatedAt: now.subtract(1, 'day').format('YYYY-MM-DD'),
			publishedAt: now.subtract(1, 'day').format('YYYY-MM-DD'),
		},
		{
			id: 'post-7',
			title: 'Nháp: cấu trúc danh mục nội dung',
			slug: 'nhap-cau-truc-danh-muc-noi-dung',
			summary: 'Bản nháp về cách chia nhóm bài viết theo chủ đề trước khi xuất bản chính thức.',
			content: `# Nháp: cấu trúc danh mục nội dung

Đây là bài nháp để quản trị viên xem trước luồng nội dung.
`,
			coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
			tags: ['Career', 'Writing'],
			status: 'DRAFT',
			viewCount: 4,
			authorName: defaultAuthor.name,
			createdAt: now.subtract(2, 'day').format('YYYY-MM-DD'),
			updatedAt: now.subtract(2, 'day').format('YYYY-MM-DD'),
		},
		{
			id: 'post-8',
			title: 'Component hoá nội dung blog',
			slug: 'component-hoa-noi-dung-blog',
			summary: 'Dùng các component tái sử dụng để xây trang blog dễ bảo trì và mở rộng hơn.',
			content: `# Component hoá nội dung blog

Một blog tốt nên có các khối tái sử dụng:

- Card bài viết
- Bộ lọc tag
- Khu vực bài viết liên quan
- Form quản trị
`,
			coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
			tags: ['React', 'TypeScript', 'Web Performance'],
			status: 'PUBLISHED',
			viewCount: 33,
			authorName: defaultAuthor.name,
			createdAt: now.subtract(4, 'day').format('YYYY-MM-DD'),
			updatedAt: now.subtract(3, 'day').format('YYYY-MM-DD'),
			publishedAt: now.subtract(4, 'day').format('YYYY-MM-DD'),
		},
		{
			id: 'post-9',
			title: 'Tạo nhịp viết cá nhân bền vững',
			slug: 'tao-nhip-viet-ca-nhan-ben-vung',
			summary: 'Đặt lịch, theo dõi tiến độ và chấp nhận các bài viết ngắn cũng là một dạng xuất bản hiệu quả.',
			content: `# Tạo nhịp viết cá nhân bền vững

Viết đều đặn cần một hệ thống đủ nhẹ:

- Mẫu bài viết sẵn
- Lịch xuất bản đơn giản
- Mục tiêu theo tuần
`,
			coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
			tags: ['Productivity', 'Writing'],
			status: 'PUBLISHED',
			viewCount: 22,
			authorName: defaultAuthor.name,
			createdAt: now.subtract(8, 'day').format('YYYY-MM-DD'),
			updatedAt: now.subtract(7, 'day').format('YYYY-MM-DD'),
			publishedAt: now.subtract(8, 'day').format('YYYY-MM-DD'),
		},
		{
			id: 'post-10',
			title: 'Lựa chọn tag để người đọc tìm bài nhanh hơn',
			slug: 'lua-chon-tag-de-nguoi-doc-tim-bai-nhanh-hon',
			summary: 'Tag không nên quá nhiều. Chúng là tín hiệu dẫn hướng, không phải danh sách từ khóa ngẫu nhiên.',
			content: `# Lựa chọn tag để người đọc tìm bài nhanh hơn

Tag nên phản ánh chủ đề lõi của bài viết và có thể tái sử dụng ở nhiều bài khác.
`,
			coverImage: 'https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?auto=format&fit=crop&w=1200&q=80',
			tags: ['UI/UX', 'Writing'],
			status: 'PUBLISHED',
			viewCount: 19,
			authorName: defaultAuthor.name,
			createdAt: now.subtract(10, 'day').format('YYYY-MM-DD'),
			updatedAt: now.subtract(9, 'day').format('YYYY-MM-DD'),
			publishedAt: now.subtract(10, 'day').format('YYYY-MM-DD'),
		},
	];
};

const slugify = (value: string) =>
	value
		.normalize('NFD')
		.replace(/[^\w\s-]/g, '')
		.replace(/[\u0300-\u036f]/g, '')
		.trim()
		.toLowerCase()
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');

const readJson = <T,>(key: string, fallback: T): T => {
	if (!isBrowser) return fallback;
	const raw = window.localStorage.getItem(key);
	if (!raw) return fallback;
	try {
		return JSON.parse(raw) as T;
	} catch {
		return fallback;
	}
};

const writeJson = <T,>(key: string, value: T) => {
	if (!isBrowser) return;
	window.localStorage.setItem(key, JSON.stringify(value));
};

const seedIfNeeded = () => {
	if (!isBrowser) return;
	if (!window.localStorage.getItem(AUTHOR_KEY)) {
		writeJson(AUTHOR_KEY, defaultAuthor);
	}
	if (!window.localStorage.getItem(TAGS_KEY)) {
		writeJson(TAGS_KEY, seedTags);
	}
	if (!window.localStorage.getItem(POSTS_KEY)) {
		writeJson(POSTS_KEY, seedPosts());
	}
};

const normalizeName = (value: string) => value.trim().toLowerCase();

const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const getPostsStore = () => {
	seedIfNeeded();
	return readJson<BlogPost[]>(POSTS_KEY, seedPosts());
};

const setPostsStore = (posts: BlogPost[]) => writeJson(POSTS_KEY, posts);

const getTagsStore = () => {
	seedIfNeeded();
	return readJson<BlogTag[]>(TAGS_KEY, seedTags);
};

const setTagsStore = (tags: BlogTag[]) => writeJson(TAGS_KEY, tags);

const syncTagRegistry = (posts: BlogPost[]) => {
	const currentTags = getTagsStore();
	const knownNames = new Set(currentTags.map((tag) => normalizeName(tag.name)));
	const nextTags = [...currentTags];
	posts.forEach((post) => {
		post.tags.forEach((tagName) => {
			if (!knownNames.has(normalizeName(tagName))) {
				knownNames.add(normalizeName(tagName));
				nextTags.push({ id: generateId('tag'), name: tagName });
			}
		});
	});
	setTagsStore(nextTags);
};

export const getBlogAuthor = (): BlogAuthor => {
	seedIfNeeded();
	return readJson<BlogAuthor>(AUTHOR_KEY, defaultAuthor);
};

export const getBlogTags = (): BlogTag[] => getTagsStore().sort((a, b) => a.name.localeCompare(b.name));

export const getBlogTagStats = () => {
	const posts = getPostsStore();
	return getBlogTags().map((tag) => ({
		...tag,
		postCount: posts.filter((post) => post.tags.some((postTag) => normalizeName(postTag) === normalizeName(tag.name))).length,
	}));
};

export const getBlogPosts = (): BlogPost[] => getPostsStore().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

export const getPublishedPosts = (): BlogPost[] =>
	getBlogPosts().filter((post) => post.status === 'PUBLISHED').sort((a, b) => +new Date(b.publishedAt || b.createdAt) - +new Date(a.publishedAt || a.createdAt));

export const getBlogPostBySlug = (slug: string) => getBlogPosts().find((post) => post.slug === slug);

export const getRelatedPosts = (slug: string, limit = 3): BlogPost[] => {
	const currentPost = getBlogPostBySlug(slug);
	if (!currentPost) return [];
	const currentTags = currentPost.tags.map(normalizeName);
	return getPublishedPosts()
		.filter((post) => post.slug !== slug)
		.filter((post) => post.tags.some((tag) => currentTags.includes(normalizeName(tag))))
		.slice(0, limit);
};

export const incrementPostViews = (slug: string) => {
	const posts = getPostsStore();
	const nextPosts = posts.map((post) => {
		if (post.slug !== slug) return post;
		return {
			...post,
			viewCount: post.viewCount + 1,
			updatedAt: moment().format('YYYY-MM-DD'),
		};
	});
	setPostsStore(nextPosts);
	return nextPosts.find((post) => post.slug === slug);
};

export const createBlogPost = (values: BlogPostFormValues) => {
	const posts = getPostsStore();
	const now = moment().format('YYYY-MM-DD');
	const slug = values.slug?.trim() || slugify(values.title);
	const nextPost: BlogPost = {
		id: generateId('post'),
		title: values.title.trim(),
		slug,
		summary: values.summary.trim(),
		content: values.content.trim(),
		coverImage: values.coverImage.trim(),
		tags: values.tags,
		status: values.status,
		viewCount: 0,
		authorName: getBlogAuthor().name,
		createdAt: now,
		updatedAt: now,
		publishedAt: values.status === 'PUBLISHED' ? now : undefined,
	};
	const nextPosts = [nextPost, ...posts];
	setPostsStore(nextPosts);
	syncTagRegistry(nextPosts);
	return nextPost;
};

export const updateBlogPost = (id: string, values: BlogPostFormValues) => {
	const posts = getPostsStore();
	const now = moment().format('YYYY-MM-DD');
	const nextPosts = posts.map((post) => {
		if (post.id !== id) return post;
		const nextSlug = values.slug?.trim() || slugify(values.title);
		return {
			...post,
			title: values.title.trim(),
			slug: nextSlug,
			summary: values.summary.trim(),
			content: values.content.trim(),
			coverImage: values.coverImage.trim(),
			tags: values.tags,
			status: values.status,
			updatedAt: now,
			publishedAt: values.status === 'PUBLISHED' ? post.publishedAt || now : undefined,
		};
	});
	setPostsStore(nextPosts);
	syncTagRegistry(nextPosts);
	return nextPosts.find((post) => post.id === id);
};

export const deleteBlogPost = (id: string) => {
	const nextPosts = getPostsStore().filter((post) => post.id !== id);
	setPostsStore(nextPosts);
	return nextPosts;
};

export const createBlogTag = (name: string, description?: string) => {
	const normalized = name.trim();
	if (!normalized) return undefined;
	const tags = getTagsStore();
	if (tags.some((tag) => normalizeName(tag.name) === normalizeName(normalized))) {
		return tags.find((tag) => normalizeName(tag.name) === normalizeName(normalized));
	}
	const nextTag: BlogTag = { id: generateId('tag'), name: normalized, description };
	const nextTags = [...tags, nextTag];
	setTagsStore(nextTags);
	return nextTag;
};

export const updateBlogTag = (id: string, name: string, description?: string) => {
	const tags = getTagsStore();
	const currentTag = tags.find((tag) => tag.id === id);
	if (!currentTag) return undefined;
	const nextName = name.trim();
	const nextTags = tags.map((tag) => (tag.id === id ? { ...tag, name: nextName, description } : tag));
	setTagsStore(nextTags);
	const nextPosts = getPostsStore().map((post) => ({
		...post,
		tags: post.tags.map((tagName) => (normalizeName(tagName) === normalizeName(currentTag.name) ? nextName : tagName)),
	}));
	setPostsStore(nextPosts);
	return nextTags.find((tag) => tag.id === id);
};

export const deleteBlogTag = (id: string) => {
	const tags = getTagsStore();
	const tag = tags.find((item) => item.id === id);
	if (!tag) return tags;
	const nextTags = tags.filter((item) => item.id !== id);
	setTagsStore(nextTags);
	const nextPosts = getPostsStore().map((post) => ({
		...post,
		tags: post.tags.filter((tagName) => normalizeName(tagName) !== normalizeName(tag.name)),
	}));
	setPostsStore(nextPosts);
	return nextTags;
};

export const getBlogStats = () => {
	const posts = getPublishedPosts();
	return {
		posts,
		totalPosts: posts.length,
		totalDrafts: getBlogPosts().filter((post) => post.status === 'DRAFT').length,
		totalViews: posts.reduce((sum, post) => sum + post.viewCount, 0),
		totalTags: getBlogTags().length,
	};
};

export const formatBlogDate = (value?: string) => (value ? moment(value).format('DD/MM/YYYY') : '-');

export const slugifyTitle = slugify;
