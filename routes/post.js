const express = require("express");
const router = express.Router();
const Post = require("../models/postSchema");

const verify = require("../middlewares/jwtverify")


//GET ALL POST 
router.get("/allposts",verify,(req,res)=>{
    Post.find().populate("postedBy","_id name").populate("comments.postedBy","_id name").then(
        (posts)=>{
            res.json({posts:posts})
        }
    ).catch(err=>{
        res.send(err)
    })
})

//GET MY POST
router.get("/mypost",verify,(req,res)=>{
    Post.find({postedBy:req.user._id}).populate("postedBy","_id name").then((mypost)=>{
        res.json({mypost})
    }).catch(err=>{
        res.send(err)
    })
})





router.post("/createpost",verify,(req,res)=>{
    const {title,body,pic}= req.body;
    if(!title||!body || !pic){
        res.status(400).send("fill all the details")
    }
   req.user.password=undefined;
    const post = new Post({
        title:title,
        body:body,
        photo:pic,
        postedBy:req.user,

    });
    post.save().then((result)=>{
      return  res.status(202).send(result)
    }).catch(err=>{
        res.send(err)
    })





   
})

//likes route

router.put("/like",verify,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    },).populate("comments.postedBy","_id name").populate("postedBy","_id name").exec((err,result)=>{
        if(err){
            res.send(err)
        }
        else{
            res.json({result})
        }
    })
})


//dislikes route



router.put("/dislike",verify,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    },).populate("comments.postedBy","_id name").populate("postedBy","_id name").exec((err,result)=>{
        if(err){
            res.send(err)
        }
        else{
            res.json({result})
        }
    })
})

//commentss route

router.put("/comment",verify,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    },).populate("comments.postedBy","_id name").exec((err,result)=>{
        if(err){
            res.send(err)
        }
        else{
            res.json({result})
        }
    })
})


module.exports= router;