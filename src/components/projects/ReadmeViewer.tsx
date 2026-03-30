interface ReadmeViewerProps {
	html: string;
	className?: string;
}

// Renderiza o HTML gerado pelo remark/rehype com estilos do portfólio
export function ReadmeViewer({ html, className = "" }: ReadmeViewerProps) {
	return (
		<div
			className={`readme-content font-roboto leading-relaxed ${className}`}
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}
