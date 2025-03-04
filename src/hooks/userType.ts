type User = {
    email: string,
    displayName?: string | null,
    pfp?: string | null,
    org?: string[] | null,
    teams?: string[] | null,
};

type UserContext = {
    user: User,
    setUser: (user: User) => void,
};

export { }