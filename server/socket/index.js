const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const UserModel = require('../models/UserModel');
const { ConversationModel, MessageModel } = require('../models/ConversationModel');
const getConversation = require('../helpers/getConversation');

const app = express();

/***socket connection */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

// Online user set
const onlineUser = new Set();

io.on('connection', async (socket) => {
  console.log('Connect User ', socket.id);

  const token = socket.handshake.auth.token;
  const user = await getUserDetailsFromToken(token);
  
  if (!user) {
    return socket.disconnect(); // Disconnect if user is not found
  }

  socket.join(user._id.toString());
  onlineUser.add(user._id.toString());
  io.emit('onlineUser', Array.from(onlineUser));

  socket.on('message-page', async (userId) => {
    const userDetails = await UserModel.findById(userId).select('-password');
    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile_pic: userDetails?.profile_pic,
      online: onlineUser.has(userId),
    };
    socket.emit('message-user', payload);

    const getConversationMessage = await ConversationModel.findOne({
      '$or': [
        { sender: user._id, receiver: userId },
        { sender: userId, receiver: user._id },
      ],
    }).populate('messages').sort({ updatedAt: -1 });

    socket.emit('message', getConversationMessage?.messages || []);
  });

  socket.on('new message', async (data) => {
    try {
      let conversation = await ConversationModel.findOne({
        '$or': [
          { sender: data.sender, receiver: data.receiver },
          { sender: data.receiver, receiver: data.sender },
        ],
      });

      if (!conversation) {
        conversation = new ConversationModel({
          sender: data.sender,
          receiver: data.receiver,
        });
        await conversation.save();
      }

      const message = new MessageModel({
        text: data.text || '',
        msgByUserId: data.msgByUserId,
      });

      const savedMessage = await message.save();
      await ConversationModel.updateOne(
        { _id: conversation._id },
        { '$push': { messages: savedMessage._id } }
      );

      // Emit the new message to both sender and receiver
      
      io.to(data.receiver).emit('message', [savedMessage]);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('sidebar', async (currentUserId) => {
    const conversation = await getConversation(currentUserId);
    socket.emit('conversation', conversation);
  });

  socket.on('seen', async (msgByUserId) => {
    const conversation = await ConversationModel.findOne({
      '$or': [
        { sender: user._id, receiver: msgByUserId },
        { sender: msgByUserId, receiver: user._id },
      ],
    });

    if (conversation) {
      const conversationMessageId = conversation.messages || [];
      await MessageModel.updateMany(
        { _id: { '$in': conversationMessageId }, msgByUserId },
        { '$set': { seen: true } }
      );

      const conversationSender = await getConversation(user._id.toString());
      const conversationReceiver = await getConversation(msgByUserId);

      io.to(user._id.toString()).emit('conversation', conversationSender);
      io.to(msgByUserId).emit('conversation', conversationReceiver);
    }
  });

  socket.on('disconnect', () => {
    onlineUser.delete(user._id.toString());
    console.log('Disconnect user ', socket.id);
  });
});

module.exports = {
  app,
  server,
};
