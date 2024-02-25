import mongoose, { Schema, InferSchemaType } from 'mongoose';

const PostAnalyticsSchema = new Schema({
  postAnalyticsId: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Post',
  },
  viewCount: {
    type: Number,
    required: true,
  },
  likeCount: {
    type: Number,
    required: true,
  },
  commentCount: {
    type: Number,
    required: true,
  },
  shareCount: {
    type: Number,
    required: true,
  },
  bookmarkCount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

export type PostAnalytics = InferSchemaType<typeof PostAnalyticsSchema>;

export const PostAnalyticsModel = mongoose.model(
  'PostAnalytics',
  PostAnalyticsSchema,
);
