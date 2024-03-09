<template>
 <div class="userimg">
     <div class="block">
       <el-upload
       class="avatar-uploader"
       :show-file-list="false"
       action="aaa"
       :before-upload="beforeUploadFile">
       <el-tooltip effect="dark" content="点击更换头像" placement="bottom-end">
         <el-avatar shape="square" :size="40" :src="imgUrl" v-if="imgUrl"></el-avatar>
       </el-tooltip>
       </el-upload>
     </div>
  </div>
 </template>
 <script>
 export default {
     data(){
         //默认的头像地址
         imgUrl:"http://localhost:3000/userimg/defaultImg.png"
        },
     mounted(){
     this.userid = sessionStorage.getItem('userid')
     this.imgUrl= sessionStorage.getItem('userimg')
     this.Userinfoform.userid = this.userid
        },
     //在上传头像前，发送请求（这里我没有搞清楚，为什么使用":data"的属性不能将参数携带到后端，所以就在文件上传前发送请求）
     async beforeUploadFile(file){
       const that=this
       const uuid = that.uuid()  //uuid函数是自己实现的，用于保证图片的唯一性
       let formdata = new FormData();
       formdata.append("file",file)
       formdata.append("userid",that.userid)  //用户的id，用于查询头像地址
       formdata.append("imgurl",that.imgUrl) //将没有更换头像的地址传给后端，后端可以根据该地址删除上一个头像
       const {data} = await that.$http.post("/admin/uploadImg",formdata,{headers:{"uuid":uuid}})
       if(data.code ===200){
         that.imgUrl=data.data[0].imgUrl //显示上传成功后的头像
         that.$store.commit('updateUserimg',data.data[0].imgUrl) //更新vuex中的imgUrl，保证用户刷新页面时，也能显示最新的头像
         that.$message.success('头像上传成功')
       }else{
         that.$message.success('头像上传失败')
       }
     },
 }
 </script>