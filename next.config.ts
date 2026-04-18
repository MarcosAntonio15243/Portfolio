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
				hostname: "opengraph.githubassets.com", // Open Graph images
			},
			{
				protocol: "https",
				hostname: "raw.githubusercontent.com", // README images
			},
			{
				protocol: "https",
				hostname: "*.githubusercontent.com", // Avatars and other assets
			},
			{
				protocol: "https",
				hostname: "github.com",
			},
		],
	},
};

export default nextConfig;
