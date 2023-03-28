import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { FilterUsersDto } from "./dto/filter-users.dto";
import { UsersService } from "./users.service";
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { NotFoundDto } from "./dto/user-notFoundError.dto";
import { NotAuthorizedDto } from "./dto/unauthorized-error.dto";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiResponse({
    description: "User records",
    isArray: true,
    type: UserDto,
    status: 200,
  })
  getAll(@Query() query: FilterUsersDto): Promise<UserDto[]> {
    const { search, limit, offset } = query;
    return this.usersService.getUsers(search, Number(limit), Number(offset));
  }

  @Get("/:id")
  @ApiResponse({
    status: 200,
    description: "Get by id",
    isArray: false,
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: "User does not exist",
    type: NotFoundDto,
  })
  getById(@Param("id") id: string): Promise<UserDto> {
    return this.usersService.getById(id);
  }

  @Post("/signin")
  @ApiResponse({
    status: 201,
    description: "User signed in successfully",
    type: UserDto,
  })
  @ApiBody({ type: UserDto })
  signIn(@Body() userDto: UserDto): Promise<{ status: string } | UserDto> {
    return this.usersService.signIn(userDto);
  }
}
