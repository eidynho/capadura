"use client";

import { ProfileDataResponse } from "@/endpoints/queries/usersQueries";
import { useGetUsersFollowsCount } from "@/endpoints/queries/followsQueries";

import { FollowersDialog } from "./follows/FollowersDialog";
import { FollowingDialog } from "./follows/FollowingDialog";
import { LinkIcon, MapPin, Twitter } from "lucide-react";
import { LinkUnderline } from "@/components/LinkUnderline";

interface ProfileHeaderProps {
    username: string;
    targetUser: ProfileDataResponse;
}

export function ProfileHeader({ targetUser, username }: ProfileHeaderProps) {
    const { data: followingCount } = useGetUsersFollowsCount({
        userId: targetUser?.id || "",
        enabled: !!targetUser?.id,
    });

    return (
        <div className="flex w-full flex-col gap-5 md:w-[28rem]">
            <div className="mt-5 flex gap-x-8 gap-y-3 md:mt-3">
                {!!targetUser?.id && (
                    <>
                        <FollowersDialog
                            username={username}
                            targetUserId={targetUser.id}
                            followersCount={followingCount?.followers || 0}
                        />

                        <FollowingDialog
                            username={username}
                            targetUserId={targetUser.id}
                            followingCount={followingCount?.following || 0}
                        />
                    </>
                )}
            </div>

            {targetUser?.description && (
                <p className="text-sm text-muted-foreground">{targetUser?.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                {targetUser?.location && (
                    <div className="flex items-center gap-1">
                        <MapPin size={16} className="text-black dark:text-white" />

                        <span className="text-muted-foreground">{targetUser.location}</span>
                    </div>
                )}

                {targetUser?.website && (
                    <div className="flex items-center gap-1">
                        <LinkIcon size={15} className="text-black dark:text-white" />

                        <LinkUnderline asChild className="font-semibold text-muted-foreground">
                            <a href={targetUser.website} target="_blank">
                                {targetUser.website}
                            </a>
                        </LinkUnderline>
                    </div>
                )}

                {targetUser?.twitter && (
                    <div className="flex items-center gap-1">
                        <Twitter size={16} className="text-black dark:text-white" />
                        <LinkUnderline asChild className="font-semibold text-muted-foreground">
                            <a href={`https://twitter.com/${targetUser?.twitter}`} target="_blank">
                                {targetUser.twitter}
                            </a>
                        </LinkUnderline>
                    </div>
                )}
            </div>
        </div>
    );
}
