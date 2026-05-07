export enum Role{
    ADMIN = "ADMIN",
    USER = "USER",
    MANAGER = "MANAGER",
    GUEST = "GUEST"
}




export interface User {
    id : string;
    name : string;
    email : string;
    role : Role;
    teamId?: string; //Optional
    team?: Team;
    createdAt: Date;
    updatedAt: Date;

}



export interface Team {
    id : string;
    name : string;
    description?: string | null;
    code : string;
    members : User[]; //Array/list of users
    createdAt: Date;
    updatedAt: Date   
}




export interface AuthContextType {
    user : User | null ;
    login : (formdata : FormData) => void;
    logout : () => void;
    hasPermission :(requiredRole : Role) => boolean
}