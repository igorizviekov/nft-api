import { UserDto } from "./users/dto/user.dto";

export type StatusType = "new record created" | "existing";

export interface IResponse {
  status: StatusType;
  record?: UserDto;
  records?: UserDto[];
}
