type User = {
    username?: string | null,
    email: string,
    pfp?: string | null,
    org?: string[] | null,
    teams?: string[] | null,
    teamMembers?: string[] | null,
    orgMemmbers?: string[] | null,
};

type UserContext = {
    user: User,
    setUser: (user: User) => void,
};

export { }