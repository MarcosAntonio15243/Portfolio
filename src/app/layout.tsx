import { ThemeProvider } from "@/components/providers";
import "./globals.css";
import type { Metadata } from "next";
import { DM_Serif_Display, Roboto, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

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
	title: "Marcos Antonio's Portfolio",
	description: "Website dedicado ao meu portfólio pessoal",
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
