/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "books.google.com",
                port: "",
            },
        ],
    },
};

module.exports = nextConfig;
