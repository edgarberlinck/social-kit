import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, type Date } from "mongoose";

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop()
  user: string;

  @Prop()
  content: string;

  @Prop({ type: Date })
  post_date: Date;

  @Prop(Date)
  network: string;
}

export const CatSchema = SchemaFactory.createForClass(Post);
