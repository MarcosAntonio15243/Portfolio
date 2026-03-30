"use client";

interface LocaleDateProps {
	dateString: string;
	options?: Intl.DateTimeFormatOptions;
}

export function LocaleDate({ dateString, options }: LocaleDateProps) {
	return (
		<span>{new Date(dateString).toLocaleDateString(undefined, options)}</span>
	);
}
