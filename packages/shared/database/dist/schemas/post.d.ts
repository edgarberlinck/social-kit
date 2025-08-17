import { HydratedDocument, type Date } from "mongoose";
export type PostDocument = HydratedDocument<Post>;
export declare class Post {
    user: string;
    content: string;
    post_date: Date;
    network: string;
}
export declare const CatSchema: import("mongoose").Schema<Post, import("mongoose").Model<Post, any, any, any, import("mongoose").Document<unknown, any, Post, any, {}> & Post & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Post, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Post>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Post> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
