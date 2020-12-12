import { Controller, Get, Post, Body, Param, NotFoundException, Req, Request, Query, HttpException, HttpStatus, Delete, UseGuards, Put } from '@nestjs/common';
import { PostM } from '../posts/posts.model';
import { Comment } from '../comments/comments.model'
import { AuthenticationGuard } from '../guards/authentication.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { User } from 'src/users/users.model';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get("/counters")
  @UseGuards(AuthenticationGuard)
  async getCounters(@Req() request: Request) {
    const logedUserData = request["user"]
    return this.adminService.count(logedUserData)
  }

  @Get("/ageranges")
  @UseGuards(AuthenticationGuard)
  async getAgeRanges(@Req() request: Request) {
    const logedUserData = request["user"]
    return this.adminService.ageRanges(logedUserData)
  }

  @Get("/users/:email")
  @UseGuards(AuthenticationGuard)
  async getUsers(@Req() request: Request,
  @Param("email") email: string) {
    const logedUserData = request["user"]
    console.log("email recebido", email)
    return await this.adminService.getUsers(logedUserData, email)
  }

  @Delete("/users/:userid")
  @UseGuards(AuthenticationGuard)
  async deleteUser(@Req() request: Request,
  @Param("userid") userid: string) {
    console.log("usuário a ser deletado:", userid)
    const logedUserData = request["user"]
    return this.adminService.deleteUser(logedUserData, userid)
  }

  @Post("/users")
  @UseGuards(AuthenticationGuard)
  async updateUser(@Req() request: Request,
  @Body() changes: User) {
    const logedUserData = request["user"]
    this.adminService.updateUser(changes, logedUserData)
  }

  @Get("/posts/:email")
  @UseGuards(AuthenticationGuard)
  async getPosts(@Req() request: Request,
  @Param("email") email: string) {
    const logedUserData = request["user"]
    return await this.adminService.getPosts(logedUserData, email)
  }

  @Delete("/posts/:postId")
  @UseGuards(AuthenticationGuard)
  async deletePost(@Req() request: Request,
  @Param("postId") postid: string) {
    console.log("post a ser deletado:", postid)
    const logedUserData = request["user"]
    return this.adminService.deletePost(logedUserData, postid)
  }

  @Get("/comments/:email")
  @UseGuards(AuthenticationGuard)
  async getComments(@Req() request: Request,
  @Param("email") email: string) {
    const logedUserData = request["user"]
    return await this.adminService.getComments(logedUserData, email)
  }

  @Delete("/comments/:commentId")
  @UseGuards(AuthenticationGuard)
  async deleteComment(@Req() request: Request,
  @Param("commentId") commentId: string) {
    const logedUserData = request["user"]
    return this.adminService.deleteComment(logedUserData, commentId)
  }

  @Get("/likes/:email")
  @UseGuards(AuthenticationGuard)
  async getLikes(@Req() request: Request,
  @Param("email") email: string) {
    const logedUserData = request["user"]
    return await this.adminService.getLikes(logedUserData, email)
  }

  @Delete("/likes/:likeId")
  @UseGuards(AuthenticationGuard)
  async deleteLike(@Req() request: Request,
  @Param("likeId") commentId: string) {
    const logedUserData = request["user"]
    return this.adminService.deleteLike(logedUserData, commentId)
  }
}  
