/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        turbo: {
            rules: {
                '*.svg': {
                    loaders: ['@svgr/webpack'],
                    as: '*.js',
                },
            },
        },
    },
    images: {
        domains: ['localhost', 'via.placeholder.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    transpilePackages: ['lucide-react'],
}

module.exports = nextConfig