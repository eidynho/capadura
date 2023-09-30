import Link from "next/link";

import { ProfileDataResponse } from "@/endpoints/queries/usersQueries";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Button } from "./ui/Button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/HoverCard";
import { LinkUnderline } from "./LinkUnderline";

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
                    <Button variant="link" size="sm" className="px-2">
                        {user.username}
                    </Button>
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
                        href={`@${user.username}`}
                        className="text-sm font-semibold hover:underline"
                    >
                        @{user.username}
                    </Link>
                    <p className="text-sm">{user.description}</p>
                    <div className="flex items-center gap-2 pt-2">
                        <LinkUnderline href="" className="text-sm">
                            <span className="mr-1 font-semibold">234</span>
                            <span className="text-muted-foreground">livros</span>
                        </LinkUnderline>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
