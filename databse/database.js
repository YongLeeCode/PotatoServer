import MongoDb from "mongodb";
import Mongoose from "mongoose";
import { config } from "../config.js";

let db;

export async function initDb() {
  return Mongoose.connect(config.db.host);

  // if(db){
  //   console.log('Db is already initialized!');
  //   return;
  // }
  // return MongoDb.MongoClient.connect(url) //
  //   .then((client) => db = client.db('potato'));
}

export function useVirtualId(schema) {
  schema.virtual("id").get(function () {
    return this._id.toString();
  });
  schema.set("toJSON", { virtuals: true });
  schema.set("toObject", { virtuals: true });
}

export function getPosts() {
  // if(!db){
  //   throw Error('Db not initialized');

  // }
  return db.collection("posts");
}

export function getCourse() {
  return db.collection("courses");
}
