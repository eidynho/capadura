import Link from "next/link";

import { ProfileDataResponse } from "@/endpoints/queries/usersQueries";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/HoverCard";

interface CardUserHoverProps {
    user: ProfileDataResponse;
}

export function CardUserHover({ user }: CardUserHoverProps) {
    return (
        <HoverCard openDelay={300}>
            <HoverCardTrigger asChild>
                <div className="flex items-center">
                    <Avatar className="h-8 w-8">
                        <AvatarImage
                            src={user.imageUrl}
                            width={32}
                            height={32}
                            loading="eager"
                            alt={`Foto de perfil de ${user.username}`}
                            title={`Foto de perfil de ${user.username}`}
                        />
                        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Link
                        href={`/@${user.username}`}
                        className="px-2 text-black hover:underline dark:text-white"
                    >
                        {user.username}
                    </Link>
                </div>
            </HoverCardTrigger>
            <HoverCardContent align="start" className="flex w-80 space-x-4">
                <Avatar>
                    <AvatarImage
                        src={user.imageUrl}
                        alt={`Foto de perfil de ${user.username}`}
                        title={`Foto de perfil de ${user.username}`}
                    />
                    <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <Link
                        href={`/@${user.username}`}
                        className="text-sm font-semibold hover:underline"
                    >
                        @{user.username}
                    </Link>
                    <p className="text-sm">{user.description}</p>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
