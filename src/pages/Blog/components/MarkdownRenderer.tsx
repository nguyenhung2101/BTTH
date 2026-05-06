import { marked } from 'marked';

type MarkdownRendererProps = {
	content: string;
};

marked.setOptions({
	breaks: true,
	gfm: true,
});

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
	const html = marked.parse(content || '');

	return <div className="blog-markdown" dangerouslySetInnerHTML={{ __html: html }} />;
}
