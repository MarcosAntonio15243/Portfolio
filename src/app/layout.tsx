import { ThemeProvider } from "@/components/providers";
import {
	DEFAULT_DESCRIPTION,
	OWNER_JOB_TITLE,
	SITE_NAME,
	SITE_URL,
} from "@/lib/seo/site";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { DM_Serif_Display, Roboto, Source_Serif_4 } from "next/font/google";

const roboto = Roboto({
	variable: "--font-roboto",
	weight: ["300", "400", "500", "600"],
	subsets: ["latin"],
});

const sourceSerif4 = Source_Serif_4({
	variable: "--font-source-serif-4",
	weight: ["300", "400"],
	subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
	variable: "--font-dm-serif-display",
	weight: ["400"],
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: `${SITE_NAME} | ${OWNER_JOB_TITLE}`,
		template: `%s | ${SITE_NAME}`,
	},
	description: DEFAULT_DESCRIPTION,
	applicationName: SITE_NAME,
	authors: [{ name: SITE_NAME, url: SITE_URL }],
	openGraph: {
		type: "website",
		siteName: SITE_NAME,
		locale: "en_US",
		url: "/",
	},
	twitter: { card: "summary_large_image" },
	...(process.env.GOOGLE_SITE_VERIFICATION
		? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
		: {}),
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${roboto.variable} ${sourceSerif4.variable} ${dmSerifDisplay.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
				<Analytics />
			</body>
		</html>
	);
}
