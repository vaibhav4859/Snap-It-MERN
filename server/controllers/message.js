import Message from "../models/MessageSchema.js";
import { StatusCodes } from 'http-status-codes';

export const postMessage = async (req, res) => {
    try {
        // const { reciever, message, sender } = req.body;
        const newMessage = new Message({
            ...req.body,
        });
        const savedMessage = await newMessage.save();
        res.status(StatusCodes.CREATED).json(savedMessage);

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

export const getMessage = async (req, res) => {
    try {
        const { reciever, sender } = req.body; // reciever-samne wala sender-me
        console.log(req.body);

        const sendMessages = await Message.find({
            sender: sender,
            reciever: reciever,
        }).sort({ updatedAt: 1 });

        const recievedMessages = await Message.find({
            sender: reciever,
            reciever: sender,
        }).sort({ updatedAt: 1 });

        const combinedMessages = [...sendMessages, ...recievedMessages];
        combinedMessages.sort((a, b) => a.updatedAt - b.updatedAt);

        const allMessages = combinedMessages.map((msg) => {
            return {
                myself: msg.sender === sender,
                message: msg.message,
            }
        });
        console.log(allMessages);

        res.status(StatusCodes.OK).json(allMessages);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

