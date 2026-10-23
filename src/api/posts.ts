import { api } from "./axios";
import type { Post } from "../types";

export const getPosts = async (): Promise<Post[]> => {
  const { data } = await api.get<Post[]>("/posts");
  return data;
};