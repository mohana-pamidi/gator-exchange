const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Rating = require('./models/rating');
const User = require('./models/users');
const Listing = require('./models/items');
const auth = require('./middleware/auth');

router.post('/', auth, async (req, res) => {
    console.log("1. HIT POST /ratings endpoint");
    try {
        const { listingId, rating, comment } = req.body;
        const reviewerId = req.user.id;
        
        console.log("2. Inputs:", { listingId, rating, reviewerId });

        const listing = await Listing.findById(listingId);
        if (!listing) {
            console.log("ERROR: Listing not found");
            return res.status(404).json({ msg: 'Listing not found' });
        }
        console.log("3. Found Listing. Owner is:", listing.owner);

        const revieweeId = listing.owner; 

        if (revieweeId.toString() === reviewerId) {
            return res.status(400).json({ msg: 'You cannot rate your own listing' });
        }

        const newRating = new Rating({
            reviewer: reviewerId,
            reviewee: revieweeId,
            listing: listingId,
            rating: rating,
            comment: comment
        });

        await newRating.save();
        console.log("4. Rating Saved!");

        const allRatings = await Rating.find({ reviewee: revieweeId });
        const count = allRatings.length;
        const totalScore = allRatings.reduce((sum, r) => sum + r.rating, 0);
        const average = count > 0 ? (totalScore / count) : 0;

        console.log("5. New Stats Calculated:", { count, average });

        const updatedUser = await User.findByIdAndUpdate(
            revieweeId,
            { averageRating: average, ratingCount: count },
            { new: true }
        );

        console.log("6. User Profile Updated");

        res.status(201).json({
            rating: newRating,
            newStats: {
                averageRating: updatedUser ? updatedUser.averageRating : average,
                ratingCount: updatedUser ? updatedUser.ratingCount : count
            }
        });

    } catch (err) {
        console.error("!!! CRASH IN RATING ROUTE !!!");
        console.error(err); 
        res.status(500).send('Server Error');
    }
});


router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const ratings = await Rating.find({ reviewee: userId })
            .populate('reviewer', 'name')
            .populate('listing', 'name') 
            .sort({ createdAt: -1 });

        res.json(ratings);
    } catch (err) {
        console.error('Error fetching user ratings:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/user-info/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/listing/:listingId', async (req, res) => {
    try {
        const ratings = await Rating.find({ listing: req.params.listingId })
            .populate('reviewer', 'name')
            .sort({ createdAt: -1 });
        res.json(ratings);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
module.exports = router;