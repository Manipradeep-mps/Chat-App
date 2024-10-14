export const getSender=(loggedUser,users)=>{
   console.log(users[0]._id)
   console.log(loggedUser._id)
   return users[0]._id === loggedUser._id? users[1].name : "Helo";

};