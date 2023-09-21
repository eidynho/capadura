/** @type {import('next').NextConfig} */

const dns = require("node:dns");
dns.setDefaultResultOrder("ipv4first");

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
    async rewrites() {
        return [
            {
                source: "/@:username",
                destination: "/usuario/:username",
            },
            {
                source: "/@:username/config",
                destination: "/usuario/:username/config",
            },
            {
                source: "/@:username/listas",
                destination: "/usuario/:username/listas",
            },
        ];
    },
};

module.exports = nextConfig;
