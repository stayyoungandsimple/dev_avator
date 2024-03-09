const pathname=path.join(__dirname,'../../public/userimg')   //保存到userimg目录下
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,pathname)
    },
    filename:(req,file,cb)=>{
        const ext = path.extname(file.originalname) //文件后缀
        const uuid = req.headers.uuid   //获取请求发送过来的请求头信息
        const fullPath =uuid+ext
        cb(null,fullPath)
    }
})

const uploader = multer({storage:storage})
router.post('/uploadImg',uploader.single('file'),async (req,res,next)=>{
    const imgpath="http://localhost:3000/userimg/"
    // const files = req.files //获取多个文件
    const {userid,imgurl}= req.body
    const filename = req.file.originalname
    const uuid = req.headers.uuid //获取请求头的uuid，该uuid和上面storage中的uuid是相同的。（这里我也没有想清楚，为什么在formdata中设置的参数，在storage的req.body不能获取到，所以只能将uuid放在请求头中）
    //因为设置了uuid的请求头，所以要在app.js中配置
   /*
   app.all('*',(req,res,next)=>{
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Headers', 'Content-Type,uuid');  //添加uuid，设置自定义的请求头
   res.header('Access-Control-Allow-Methods', '*');
   res.header('Content-Type', 'application/json;charset=utf-8');
   next();
    });
   */
    const fullPath=imgpath+uuid+path.extname(filename)
   //使用sequelize的findOrCreate()方法，该方法的用法可以参看文档
   //https://sequelize.org/master/manual/model-querying-finders.html
    const [userimg,created] = await userImg.findOrCreate({where:{userid:userid},defaults:{imgPath:fullPath,userid:userid}})
    if(!created){    //如果已经创建了该条记录，则进行更新
        userImg.update({imgPath:fullPath},{where:{userid:userid}})
    }
    const imgfileName=imgurl.split("\/").slice(-1)  //删除上一张头像
    if(imgfileName[0]!=="defaultImg.png"){  //默认的头像就不要删除了
        const FILE_PATH=path.join(__dirname,`../../public/userimg/${imgfileName}`)
        fs.unlink(FILE_PATH,()=>{console.log("删除图片成功")})    //删除服务器本地的头像
    }
    res.json({code: 200,data:[{imgUrl:fullPath}]}) //fullPath返回给前端，可以立即显示最新的头像
})