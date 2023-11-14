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
            {
                protocol: "https",
                hostname: "api.capadura.io",
                port: "",
            },
            {
                protocol: "https",
                hostname: "capadura.io",
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
                source: "/@:username/avaliacoes",
                destination: "/usuario/:username/avaliacoes",
            },
            {
                source: "/@:username/leituras",
                destination: "/usuario/:username/leituras",
            },
            {
                source: "/@:username/curtidas",
                destination: "/usuario/:username/curtidas",
            },
            {
                source: "/@:username/listas",
                destination: "/usuario/:username/listas",
            },

            {
                source: "/config",
                missing: [
                    {
                        type: "cookie",
                        key: "token",
                    },
                ],
                destination: "/entrar",
            },
            {
                source: "/convide-e-ganhe",
                missing: [
                    {
                        type: "cookie",
                        key: "token",
                    },
                ],
                destination: "/entrar",
            },
        ];
    },
};

module.exports = nextConfig;
