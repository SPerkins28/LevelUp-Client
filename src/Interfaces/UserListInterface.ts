export default interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    role: string;
}

export interface UserList {
    userList: User[],
    message: string,
}