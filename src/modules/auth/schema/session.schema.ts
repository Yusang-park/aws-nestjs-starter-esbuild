import { Schema } from 'dynamoose';

export const SessionSchema = new Schema({
  sessionId: {
    type: String,
    hashKey: true,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    index: {
      name: 'userId-index',
      type: 'global',
    },
  },
  expiresAt: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Number,
    required: true,
  },
});
