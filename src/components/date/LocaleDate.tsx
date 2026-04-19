"use client";

interface LocaleDateProps extends React.HTMLAttributes<HTMLSpanElement> {
	dateString: string;
	options?: Intl.DateTimeFormatOptions;
}

export function LocaleDate({ dateString, options, ...props }: LocaleDateProps) {
	return (
		<span {...props}>
			{new Date(dateString).toLocaleDateString("en", options)}
		</span>
	);
}
