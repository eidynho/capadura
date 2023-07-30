import { signOut } from "@/contexts/AuthContext";
import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";

interface failedRequestsQueueProps {
    resolve: (token: string) => void;
    reject: (err: AxiosError) => void;
}

export function getAPIClient(ctx?: any) {
    const cookies = parseCookies(ctx);
    let isRefreshing = false;
    let failedRequestsQueue: failedRequestsQueueProps[] = [];

    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    });

    api.interceptors.response.use(
        (response) => {
            return response;
        },
        (error: AxiosError) => {
            if (error.response?.status === 401) {
                // @ts-ignore
                if (error.response?.data?.code === "token.expired") {
                    const originalConfig = error.config;

                    if (!isRefreshing) {
                        isRefreshing = true;

                        api.patch("/token/refresh", {}, { withCredentials: true })
                            .then((response) => {
                                setCookie(undefined, "token", response.data.token, {
                                    maxAge: 60 * 60 * 24 * 10, // 10 days
                                    path: "/",
                                });

                                setCookie(undefined, "refreshToken", response.data.refreshToken, {
                                    maxAge: 60 * 60 * 24 * 30, // 30 days
                                    path: "/",
                                });

                                failedRequestsQueue.forEach((request) =>
                                    request.resolve(response.data.token),
                                );
                                failedRequestsQueue = [];
                            })
                            .catch((err) => {
                                failedRequestsQueue.forEach((request) => request.reject(err));
                                failedRequestsQueue = [];
                            })
                            .finally(() => {
                                isRefreshing = false;
                            });
                    }

                    return new Promise((resolve, reject) => {
                        if (!originalConfig) return;

                        failedRequestsQueue.push({
                            resolve: (token: string) => {
                                originalConfig.headers["Authorization"] = `Bearer ${token}`;

                                resolve(api(originalConfig));
                            },
                            reject: (err: AxiosError) => {
                                reject(err);
                            },
                        });
                    });
                } else {
                    signOut();
                }
            }

            return Promise.reject(error);
        },
    );

    if (cookies.token) {
        api.defaults.headers["Authorization"] = `Bearer ${cookies.token}`;
    }

    return api;
}
