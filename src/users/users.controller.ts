import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { FilterUsersDto } from "./dto/filter-users.dto";
import { UsersService } from "./users.service";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AuthUserDto } from "./dto/auth-user.dto";
import { DeletedUserDto } from "./dto/user-deleted.dto";
import { NotFoundDto } from "./dto/user-notFoundError.dto";
import { NotAuthorizedDto } from "./dto/unauthorized-error.dto";
import { SignInDto } from "./dto/signin.dto";
import { IResponse } from "src/app.types";

@Controller("users")
@ApiTags("Users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiResponse({
    description: "User records",
    isArray: true,
    type: UserDto,
    status: 200,
  })
  getAll(@Query() query: FilterUsersDto): Promise<IResponse> {
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
  getById(@Param("id") id: string): Promise<IResponse> {
    return this.usersService.getById(id);
  }

  @Post("/signin")
  @ApiResponse({
    status: 201,
    description: "User signed in successfully",
    type: SignInDto,
  })
  @ApiBody({ type: AuthUserDto })
  signIn(@Body() userDto: UserDto): Promise<IResponse> {
    return this.usersService.signIn(userDto);
  }

  @UseGuards(AuthGuard())
  @Patch("/:id")
  @ApiOkResponse({
    description: "User updated successfully",
    isArray: false,
    type: UserDto,
  })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: AuthUserDto })
  @ApiNotFoundResponse({
    description: "User does not exist",
    type: NotFoundDto,
  })
  @ApiUnauthorizedResponse({
    description: "Invalid credentails",
    type: NotAuthorizedDto,
  })
  update(
    @Body() body: AuthUserDto,
    @Param("id") id: string
  ): Promise<IResponse> {
    return this.usersService.update(id, body);
  }

  @UseGuards(AuthGuard())
  @Delete("/:id")
  @ApiBearerAuth("access-token")
  @ApiResponse({
    status: 200,
    description: "User Deleted",
    isArray: false,
    type: DeletedUserDto,
  })
  @ApiUnauthorizedResponse({
    description: "Invalid credentails",
    type: NotAuthorizedDto,
  })
  @ApiNotFoundResponse({
    description: "User does not exist",
    type: NotFoundDto,
  })
  remove(@Param("id") id: string): Promise<IResponse> {
    return this.usersService.remove(id);
  }
}
