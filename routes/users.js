const route  = require("express").Router();
const bcrypt = require("bcrypt");
const User   = require("../model/User");

route.put("/:id", async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin)
    {
        if(req.body.password){
            try
            {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(err)
            {
                res.status(500).json(err)
            }
        }

        try 
        {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });

            res.status(200).json("Your account has been updated successfuly!");
        }catch(err) 
        {
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("Youu can only update your own account!");
    }
});

route.delete("/:id",async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin)
    {
        try 
        {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Your account has been deleted successfuly!");
        }catch(err) 
        {
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("Youu can only delete your own account!");
    }
});

route.get("/:id", async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        const {isAdmin, createdAt, updatedAt, __v, password, ...other} = user._doc;
        res.status(200).json(other);
    }catch(err) 
    {
        res.status(500).json(err);
    }
})

route.put("/:id/follow", async (req, res) => {
    if(req.body.userId !== req.params.id)
    {
        let currentUser = await User.findById(req.body.userId);
        let user = await User.findById(req.params.id);

        if(!currentUser.following.includes(req.params.id))
        {
            await currentUser.updateOne({$push:{following: req.params.id}});
            await user.updateOne({$push: {followers:req.params.id}});
            res.status(200).json("User has been followed");
        }else
        {
            res.status(403).json("You already follow this user");
        }
    }else{
        res.status(403).json("You can't follow yourself");
    }
});


route.put("/:id/unfollow", async (req, res) => {
    if(req.body.userId !== req.params.id)
    {
        let currentUser = await User.findById(req.body.userId);
        let user = await User.findById(req.params.id);

        if(currentUser.following.includes(req.params.id))
        {
            await currentUser.updateOne({$pull:{following: req.params.id}});
            await user.updateOne({$pull: {followers:req.params.id}});
            res.status(200).json("User has been unfollowed");
        }else
        {
            res.status(403).json("You don't follow this user.");
        }
    }else{
        res.status(403).json("You can't unfollow yourself");
    }
})

module.exports = route;