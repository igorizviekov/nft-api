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
import { AuthUserDto } from "./dto/auth-user.dto";
import { NotAuthorizedDto } from "./dto/unauthorized-error.dto";
import { SignInDto } from "./dto/signin.dto";

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
  //create a new record
  @Post("/signup")
  @ApiResponse({
    status: 201,
    description: "New user created",
    isArray: false,
    type: UserDto,
  })
  @ApiBody({ type: AuthUserDto })
  createOne(@Body() userDto: UserDto): Promise<UserDto> {
    return this.usersService.signUp(userDto);
  }

  @Post("/signin")
  @ApiResponse({
    status: 201,
    description: "User signed in successfully",
    type: SignInDto,
  })
  @ApiUnauthorizedResponse({
    description: "Invalid credentails",
    type: NotAuthorizedDto,
  })
  @ApiBody({ type: AuthUserDto })
  signIn(@Body() userDto: UserDto): Promise<{ accessToken: string }> {
    return this.usersService.signIn(userDto);
  }
}
