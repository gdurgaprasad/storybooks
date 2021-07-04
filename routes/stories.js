const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const Story = require("../models/Story");

// @desc  REDIRECT TO STORY FORM
// @route  GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
    res.render("stories/add")

});

// @desc  SAVE STORY
// @route POST /stories/
router.post("/", ensureAuth, async (req, res) => {
    try {
        const { title, status, body } = req.body;
        const story = { title, status, body, user: req.user._id }
        await Story.create(story)
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
});

// @desc  FETCH PUBLIC STORIES
// @route GET /stories/
router.get("/", ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
        res.render('stories/index', { stories })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
});

// @desc  Fetch Story Detail 
// @route GET /stories/:id
router.get("/:id", ensureAuth, async (req, res) => {
    try {
        const story = await Story.findById(req.params.id)
            .populate('user')
            .lean()
        if (!story) {
            return ('error/404')
        }
        res.render('stories/story', { story })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
});

// @desc  Render edit Story page
// @route GET /stories/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({ _id: req.params.id }).lean();
        if (!story) {
            res.render('error/404')
        }
        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            res.render('stories/edit', { story })
        }
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
});

// desc Fetch User Stories
// @route /stories/user/:userId
router.get("/user/:userId", ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.params.userId, status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
        res.render('stories/index', { stories })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})
// @desc  Update Story
// @route PUT /stories/:id
router.put("/:id", ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean();
        if (!story) {
            res.render('error/404')
        }
        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true
            })
            res.redirect('/dashboard')
        }
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
});

// @desc Delete story
// @route DELETE /stories/:id
router.delete("/:id", ensureAuth, async (req, res) => {
    try {
        const story = await Story.findById(req.params.id).lean();
        if (!story) {
            res.render('error/404')
        }
        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            await Story.deleteOne({ _id: story._id })
            res.redirect('/dashboard')
        }
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})
module.exports = router;
