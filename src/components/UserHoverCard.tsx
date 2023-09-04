import { ProfileDataResponse } from "@/endpoints/queries/usersQueries";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Button } from "./ui/Button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/HoverCard";
import { LinkUnderline } from "./LinkUnderline";

interface UserHoverCardProps {
    user: ProfileDataResponse;
}

export function UserHoverCard({ user }: UserHoverCardProps) {
    return (
        <HoverCard openDelay={300}>
            <HoverCardTrigger asChild>
                <div className="flex items-center">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.imageUrl} />
                        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Button variant="link" size="sm" className="px-2">
                        {user.username}
                    </Button>
                </div>
            </HoverCardTrigger>
            <HoverCardContent align="start" className="flex w-80 space-x-4">
                <Avatar>
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <h4 className="text-sm font-semibold">@{user.username}</h4>
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
