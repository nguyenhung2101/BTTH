export type BlogPostStatus = 'DRAFT' | 'PUBLISHED';

export interface BlogTag {
	id: string;
	name: string;
	description?: string;
}

export interface BlogAuthorSocialLink {
	label: string;
	url: string;
}

export interface BlogAuthor {
	name: string;
	role: string;
	avatar: string;
	bio: string;
	skills: string[];
	socialLinks: BlogAuthorSocialLink[];
}

export interface BlogPost {
	id: string;
	title: string;
	slug: string;
	summary: string;
	content: string;
	coverImage: string;
	tags: string[];
	status: BlogPostStatus;
	viewCount: number;
	authorName: string;
	createdAt: string;
	updatedAt: string;
	publishedAt?: string;
}

export interface BlogPostFormValues {
	title: string;
	slug: string;
	summary: string;
	content: string;
	coverImage: string;
	tags: string[];
	status: BlogPostStatus;
}
