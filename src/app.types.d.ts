import { User } from "./users/users.entity";

type StatusType = "success" | "delete success";
type UsersResponseType = User | User[] | IAccessToken;

interface IAccessToken {
  accessToken: string;
}

export interface IResponse {
  status: StatusType;
  // TODO add types
  data?: UsersResponseType | any;
}
