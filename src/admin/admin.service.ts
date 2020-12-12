import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { PostM } from '../posts/posts.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from '../users/users.model';
import { imageFileFilter } from 'src/utils/file-uploading.utils';
import * as fs from 'fs';
import { baseUrl } from 'src/constants';
import { Comment } from '../comments/comments.model';
import { Like } from '../likes/likes.model';
import { Console } from 'console';

@Injectable()
export class AdminService {

  constructor(
    @InjectModel(PostM) private readonly postModel: ReturnModelType<typeof PostM>,
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
    @InjectModel(Comment) private readonly commentModel: ReturnModelType<typeof Comment>,
    @InjectModel(Like) private readonly likeModel: ReturnModelType<typeof Like>
  ) {}

  async count(logedUserData){
    let counters = { users: 0, posts: 0, comments: 0, likes:0}
    const autorized = await this.userModel.find( { $and: [ {email: logedUserData.email }, { admin: true }]}).countDocuments()
      if(autorized === 0 ) {
        throw new UnauthorizedException
      }
      if(autorized > 0){
        counters.users = await this.userModel.find().countDocuments();
        counters.posts = await this.postModel.find().countDocuments();
        counters.comments = await this.commentModel.find().countDocuments();
        counters.likes = await this.likeModel.find().countDocuments();
      }
      function calculateAge(birthday) { // birthday is a date
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
      }
      return counters
  }

  async ageRanges(logedUserData){
    let ranges = { "0-20": 0, "20-40": 0, "40-60": 0, "60+":0}

    function calculateAge(birthday) { // birthday is a date
      var ageDifMs = Date.now() - birthday.getTime();
      var ageDate = new Date(ageDifMs); // miliseconds from epoch
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    const autorized = await this.userModel.find( { $and: [ {email: logedUserData.email }, { admin: true }]}).countDocuments()
      if(autorized === 0 ) {
        throw new UnauthorizedException
      }
      if(autorized > 0){
       const users = await this.userModel.find();
       users.map((single)=>{
         if(calculateAge(single.birthdate) <= 20 ){ranges["0-20"] = ranges["0-20"] +1}
         if(calculateAge(single.birthdate) > 20 && calculateAge(single.birthdate) <= 40  ){ranges["20-40"] = ranges["20-40"] +1}
         if(calculateAge(single.birthdate) > 40 && calculateAge(single.birthdate) <= 60  ){ranges["40-60"] = ranges["40-60"] +1}
         if(calculateAge(single.birthdate) > 60 ){ranges["60+"] = ranges["60+"] +1}
       })
       return ranges
      }
  }

  async getUsers(logedUserData, emailsearched){
    const autorized = await this.userModel.find( { $and: [ {email: logedUserData.email }, { admin: true }]}).countDocuments()
      if(autorized === 0 ) {
        throw new UnauthorizedException
      }
      if(autorized > 0){
        if(emailsearched === "empty"){
          let response = await this.userModel.find().lean();
          response.map((single,i)=>{
              response[i]["id"] = response[i]._id 
              let datestring = response[i].birthdate.toISOString();
              response[i]["birthdateconverted"] = datestring.slice(0,10)
          })
          return response  
          }
        if(emailsearched !== "empty"){
          let response = await this.userModel.find({email: { $regex: emailsearched , $options: 'i' }}).lean();
          response.map((single,i)=>{
              response[i]["id"] = response[i]._id 
              let datestring = response[i].birthdate.toISOString();
              response[i]["birthdateconverted"] = datestring.slice(0,10)
          })
          return response  
        }
       
      }
    }

      async deleteUser(logedUserData, userid){
        const autorized = await this.userModel.find( { $and: [ {email: logedUserData.email }, { admin: true }]}).countDocuments()
        if(autorized === 0 ) {
          throw new UnauthorizedException
        }
        if(autorized > 0){
          await this.userModel.deleteOne({_id: userid})
          await this.postModel.deleteMany({userId: userid})
          await this.commentModel.deleteMany({userId: userid})
          await this.userModel.deleteMany({userId: userid})
          await this.likeModel.deleteMany({userId: userid})
          return true
          }
      }
      
      async updateUser(changes: Partial<User>, logedUserData) {
       await this.userModel.findOneAndUpdate({ _id: changes["id"] }, changes, { new: true });
      }

      async getPosts(logedUserData, emailsearched){
        const autorized = await this.userModel.find( { $and: [ {email: logedUserData.email }, { admin: true }]}).countDocuments()
          if(autorized === 0 ) {
            throw new UnauthorizedException
          }
          if(autorized > 0){
            if(emailsearched === "empty"){
              let response = await this.postModel.find().populate("userId", "name email").lean();
              response.map((single,i)=>{
                response[i]["id"] = response[i]._id 
                response[i]["name"] = response[i].userId["name"]
                response[i]["email"] = response[i].userId["email"]
                if(!response[i].likes){
                  response[i].likes = 0
                }
            })
              console.log(response) 
              return response 
              }
            if(emailsearched !== "empty"){
              let all = await this.postModel.find().populate("userId", "name email").lean();
              let response = []
              all.forEach(element => {
                const loweremail = element.userId["email"].toLowerCase()
                const lowersearch = emailsearched.toLowerCase()
                if(loweremail.includes(lowersearch) === true){
                  response.push(element)
                }
              });
              response.map((single,i)=>{
                response[i]["id"] = response[i]._id 
                response[i]["name"] = response[i].userId["name"]
                response[i]["email"] = response[i].userId["email"]
                if(!response[i].likes){
                  response[i].likes = 0
                }
              })
              return response  
            } 
          }
        }

        async deletePost(logedUserData, postid){
          const autorized = await this.userModel.find( { $and: [ {email: logedUserData.email }, { admin: true }]}).countDocuments()
          if(autorized === 0 ) {
            throw new UnauthorizedException
          }
          if(autorized > 0){
            console.log(postid)
            await this.postModel.deleteOne({_id: postid})
            await this.commentModel.deleteMany({post: postid})
            await this.likeModel.deleteMany({post: postid})
            return true
            }
        }

        async getComments(logedUserData, emailsearched){
          const autorized = await this.userModel.find( { $and: [ {email: logedUserData.email }, { admin: true }]}).countDocuments()
            if(autorized === 0 ) {
              throw new UnauthorizedException
            }
            if(autorized > 0){
              if(emailsearched === "empty"){
                let response = await this.commentModel.find().populate("userId", "name email").lean();
                response.map((single,i)=>{
                  response[i]["id"] = response[i]._id 
                  response[i]["name"] = response[i].userId["name"]
                  response[i]["email"] = response[i].userId["email"]
                  if(!response[i].likes){
                    response[i].likes = 0
                  }
              })
                console.log(response) 
                return response 
                }
              if(emailsearched !== "empty"){
                let all = await this.commentModel.find().populate("userId", "name email").lean();
                let response = []
                all.forEach(element => {
                  const loweremail = element.userId["email"].toLowerCase()
                  const lowerpost = element.post.toString().toLowerCase()
                  const lowersearch = emailsearched.toLowerCase()
                  if(loweremail.includes(lowersearch) === true || lowerpost.includes(lowersearch)){
                    response.push(element)
                  }
                });
                response.map((single,i)=>{
                  response[i]["id"] = response[i]._id 
                  response[i]["name"] = response[i].userId["name"]
                  response[i]["email"] = response[i].userId["email"]
                  if(!response[i].likes){
                    response[i].likes = 0
                  }
                })
                return response  
              } 
            }
          }

          async deleteComment(logedUserData, commentId){
            const autorized = await this.userModel.find( { $and: [ {email: logedUserData.email }, { admin: true }]}).countDocuments()
            if(autorized === 0 ) {
              throw new UnauthorizedException
            }
            if(autorized > 0){
              await this.commentModel.deleteOne({_id: commentId})
              return true
              }
          }

          async getLikes(logedUserData, emailsearched){
            const autorized = await this.userModel.find( { $and: [ {email: logedUserData.email }, { admin: true }]}).countDocuments()
              if(autorized === 0 ) {
                throw new UnauthorizedException
              }
              if(autorized > 0){
                if(emailsearched === "empty"){
                  let response = await this.likeModel.find().populate("userId", "name email").lean();
                  response.map((single,i)=>{
                    response[i]["id"] = response[i]._id 
                    response[i]["name"] = response[i].userId["name"]
                    response[i]["email"] = response[i].userId["email"]
                })
                  console.log(response) 
                  return response 
                  }
                if(emailsearched !== "empty"){
                  let all = await this.likeModel.find().populate("userId", "name email").lean();
                  let response = []
                  all.forEach(element => {
                    const loweremail = element.userId["email"].toLowerCase()
                    const lowerpost = element.post.toString().toLowerCase()
                    const lowersearch = emailsearched.toLowerCase()
                    if(loweremail.includes(lowersearch) === true || lowerpost.includes(lowersearch)){
                      response.push(element)
                    }
                  });
                  response.map((single,i)=>{
                    response[i]["id"] = response[i]._id 
                    response[i]["name"] = response[i].userId["name"]
                    response[i]["email"] = response[i].userId["email"]
                  })
                  return response  
                } 
              }
            }
  
            async deleteLike(logedUserData, likeId){
              const autorized = await this.userModel.find( { $and: [ {email: logedUserData.email }, { admin: true }]}).countDocuments()
              if(autorized === 0 ) {
                throw new UnauthorizedException
              }
              if(autorized > 0){
                const completeLike = await this.likeModel.findOne({_id: likeId})
                await this.likeModel.deleteOne({_id: likeId})
                await this.postModel.findOneAndUpdate({_id: completeLike.post}, { "$inc": { likes: -1 } })
                return true
                }
            } 
}