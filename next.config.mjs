/** @type {import('next').NextConfig} */

const nextConfig = {
	serverExternalPackages: ["sweph"],
	turbopack: {},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.supabase.co",
			},
		],
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	allowedDevOrigins: ["*.theopenbuilder.com"],
};

export default nextConfig;
