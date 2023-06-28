import User from "../models/UserSchema.js";
import { StatusCodes } from "http-status-codes";

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const arrayUser = [user];
        const formattedUser = arrayUser.map(
            ({ _id, firstName, lastName, occupation, location, picturePath, email, friends, linkedinUrl, twitterUrl, viewedProfile, impressions, otp }) => {
                return { _id, firstName, lastName, occupation, location, picturePath, email, friends, linkedinUrl, twitterUrl, viewedProfile, impressions, otp };
            }
        );
        console.log(formattedUser[0]);
        res.status(StatusCodes.OK).json(formattedUser[0]);
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
};

export const getSingleUser = async (req, res) => {
    try {
        const { email } = req.body;
        const allUsers = await User.find({});

        const singleUser = allUsers.filter(user => user.email === email);
        let formattedUser = singleUser;
        if (singleUser) {
            formattedUser = singleUser.map(
                ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                    return { _id, firstName, lastName, occupation, location, picturePath };
                }
            );
        }
        res.status(StatusCodes.OK).json(formattedUser);
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        // console.log(friends, formattedFriends);
        res.status(StatusCodes.OK).json(formattedFriends);
    } catch (err) {
        res.status(StatusCodes.NOT_FOUND).json({ message: err.message });
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        let allUsers = await User.find({});

        const suggestedUsers = allUsers.filter(item => {
            return user.friends.includes(item._id.toString()) === false && item._id != id;
        })
        // console.log(suggestedUsers.length);

        const formattedSuggested = suggestedUsers.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        res.status(StatusCodes.OK).json(formattedSuggested);
    } catch (err) {
        res.status(StatusCodes.NOT_FOUND).json({ message: err.message });
    }
}

export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);
        console.log(id, user, friendId, friend);

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        console.log("after ", user, friend);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        console.log(formattedFriends);
        res.status(StatusCodes.OK).json(formattedFriends);
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.NOT_FOUND).json({ message: err.message });
    }
};

export const updateSocialProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { linkedinURL, twitterURL } = req.body;
        const user = await User.findById(id);
        user.linkedinUrl = linkedinURL;
        user.twitterUrl = twitterURL;
        console.log(user);
        const updatedUser = await User.findOneAndUpdate({ _id: id }, {
            ...user,
        }, { new: true, runValidators: true });

        res.status(StatusCodes.OK).json(updatedUser);
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({ message: err.message });
    }
}