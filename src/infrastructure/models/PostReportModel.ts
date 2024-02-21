import mongoose, { InferSchemaType, Schema } from 'mongoose';

const PostReportSchema = new mongoose.Schema(
  {
    postReportId: {
      type: String,
      required: true,
    },
    reportedPostId: {
      type: String,
      required: true,
    },
    reporterUserId: {
      type: String,
      required: true,
    },
    reportedPost: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    reporterUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      enum: ['spam', 'inappropriate', 'hate-speech', 'harassment', 'other'],
      required: true,
    },
    isOtherReason: {
      type: Boolean,
      required: true,
    },
    otherDetails: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export type PostReport = InferSchemaType<typeof PostReportSchema>;

export const PostReportModel = mongoose.model('PostReport', PostReportSchema);
