const route = require("express").Router();
const Post  = require("../model/Post");
const User  = require("../model/User");

// CREATE POST
route.post("/", async (req, res) => {
    const post = await new Post(req.body);
    try{
        const svPost = await post.save();
        console.log(svPost);
        res.status(200).json(svPost);
    }catch(err) {
        res.status(500).json(err);
    }
});

// UPDATE POST
route.put("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(req.body.userId == post.userId)
        {
            const upPost = await post.updateOne({$set:req.body});
            res.status(200).json("Post updated successfully!");
        }else{
            res.status(403).json("You can update only your post");
        }
        
    }catch(e){
        res.status(500).json(e)
    }
});

// DELETE POST
route.delete("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(req.body.userId === post.userId)
        {
            await post.deleteOne();
            res.status(200).json("Post deleted successfully!");
        }else{
            res.status(403).json("You can delete only your post");
        }
        
    }catch(e){
        res.status(500).json(e)
    }
});

// LIKE / DISLIKE A POST
route.put("/:id/like", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({ $push: { likes: req.body.userId }});
            res.status(200).json("Post liked!");
        }else{
            await post.updateOne({ $pull: { likes: req.body.userId }});
            res.status(200).json("Post disliked!");
        }
    }catch(e){
        res.status(500).json(e);
    }
});

// GET A POST
route.get("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(e){
        res.status(500).json(e);
    }
});

// GET TIMELINE POSTS
route.get("/timeline/posts", async (req, res) => {
    try{
        const currentUser       = await User.findById(req.body.userId);
        const currentUserPosts  = await Post.find({userId: req.body.userId}); // userId: currentUser._id
        const friendPosts       = await Promise.all(
            currentUser.following.map(async (friendId) => {
                return await Post.find({userId: friendId});
            })
        );
        res.status(200).json(currentUserPosts.concat(...friendPosts));

    }catch(e){
        res.status(500).json(e)
    }
});

module.exports = route;