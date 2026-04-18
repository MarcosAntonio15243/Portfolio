import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	// output: "export",
	images: {
		qualities: [75, 85, 90, 95],
		minimumCacheTTL: 3600,
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "opengraph.githubassets.com", // og-image do GitHub
			},
			{
				protocol: "https",
				hostname: "raw.githubusercontent.com", // imagens do README
			},
			{
				protocol: "https",
				hostname: "*.githubusercontent.com", // avatares e assets
			},
			{
				protocol: "https",
				hostname: "github.com",
			},
		],
	},
};

export default nextConfig;
