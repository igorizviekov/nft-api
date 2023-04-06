import { User } from "./users/users.entity";
import { Nft } from "./nft/nft.entity";

type StatusType = "success" | "delete success";
type UsersResponseType = User | User[] | IAccessToken;
type NftResponseType = Nft;

interface IAccessToken {
  accessToken: string;
}

export interface IResponse {
  status: StatusType;
  data?: UsersResponseType | NftResponseType;
}
