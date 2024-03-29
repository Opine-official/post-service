import mongoose, { Schema, InferSchemaType } from 'mongoose';

const PostSchema = new Schema(
  {
    postId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: Schema.Types.Mixed, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: {
      type: [String],
      validate: [arrayLimit, '{PATH} exceeds the limit of 5'],
    },
    slug: {
      type: String,
      required: true,
    },
    isDraft: {
      type: Boolean,
      required: true,
    },
    isThreadsEnabled: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true },
);

function arrayLimit(val: string[]): boolean {
  return val.length <= 5;
}

type PostModel = InferSchemaType<typeof PostSchema>;

const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
