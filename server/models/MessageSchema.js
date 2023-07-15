import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        required: true,
    },
    reciever: {
        type: String,
        required: true,
    },
}, { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
