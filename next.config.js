/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "books.google.com",
                port: "",
            },
            {
                protocol: "https",
                hostname: "d3pct9qj0imfur.cloudfront.net",
                port: "",
            },
        ],
    },
};

module.exports = nextConfig;
