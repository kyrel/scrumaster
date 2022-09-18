export interface User {
    uid: string,
    email: string | null
}

export interface Ticket {
    id: string,
    text: string,
    hasCurrentUserVote: boolean,
    otherVoteCount: number
}

export interface Category {
    id: string,
    name: string,
    tickets: Ticket[],
    unusedCurrentUserVotes: number
}