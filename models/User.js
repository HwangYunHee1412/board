var mongoose = require("mongoose");

// schema // 1
var userSchema = mongoose.Schema({
 username:{type:String, required:[true,"Username is required!"], unique:true},
 password:{type:String, required:[true,"Password is required!"], select:false},
 name:{type:String, required:[true,"Name is required!"]},
 email:{type:String}
},{
 toObject:{virtuals:true}
});

// virtuals
// DB에 저장되는 값은 password인데, 회원가입, 정보 수정시에는 위 값들이 필요. DB에 저장되지 않아도 되는 정보들은 virtual로 만들어줌
userSchema.virtual("passwordConfirmation")
.get(function(){ return this._passwordConfirmation; })
.set(function(value){ this._passwordConfirmation=value; });

userSchema.virtual("originalPassword")
.get(function(){ return this._originalPassword; })
.set(function(value){ this._originalPassword=value; });

userSchema.virtual("currentPassword")
.get(function(){ return this._currentPassword; })
.set(function(value){ this._currentPassword=value; });

userSchema.virtual("newPassword")
.get(function(){ return this._newPassword; })
.set(function(value){ this._newPassword=value; });

// password validation
// virtual들은 직접 validation이 안되기 때문에(DB에 값을 저장하지 않으니까 어찌보면 당연합니다) password에서 값을 확인
userSchema.path("password").validate(function(v) {
 var user = this; //this는 user model

 // create user
 if(user.isNew){ // DB에 한번도 기록되지 않았던 model
  if(!user.passwordConfirmation){
   user.invalidate("passwordConfirmation", "Password Confirmation is required!");
  }
  if(user.password !== user.passwordConfirmation) {
   user.invalidate("passwordConfirmation", "Password Confirmation does not matched!");
  }
 }

 // update user
 if(!user.isNew){
  if(!user.currentPassword){
   user.invalidate("currentPassword", "Current Password is required!");
  }
  if(user.currentPassword && user.currentPassword != user.originalPassword){
   user.invalidate("currentPassword", "Current Password is invalid!");
  }
  if(user.newPassword !== user.passwordConfirmation) {
   user.invalidate("passwordConfirmation", "Password Confirmation does not matched!");
  }
 }
});

// model & export
var User = mongoose.model("user",userSchema);
module.exports = User;
