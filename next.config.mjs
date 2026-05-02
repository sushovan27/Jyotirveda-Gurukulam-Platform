/** @type {import('next').NextConfig} */

const nextConfig = {
	poweredByHeader: false,
	serverExternalPackages: ["sweph"],
	turbopack: {},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.supabase.co",
			},
			{
				protocol: "https",
				hostname: "blogs.jyotirvedantagurukulam.in",
			},
		],
		minimumCacheTTL: 86400,
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-DNS-Prefetch-Control",
						value: "on",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
					{
						key: "X-XSS-Protection",
						value: "1; mode=block",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
				],
			},
		];
	},
	allowedDevOrigins: ["*.theopenbuilder.com"],
};

export default nextConfig;
