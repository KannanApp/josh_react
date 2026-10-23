import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import DataTable from "../components/DataTable";
import { getPosts } from "../api/posts";
import type { Post } from "../types";

export default function PostsPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    staleTime: 60_000,
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Posts from API</h1>
        <Link className="btn secondary" to="/">
          User Form
        </Link>
      </div>

      {isError && (
        <div className="alert error">
          {(error as Error).message || "Unable to load posts"}
        </div>
      )}

      <button className="btn primary refresh-btn" onClick={() => refetch()} disabled={isFetching}>
        {isFetching ? "Refreshing..." : "Refresh"}
      </button>

      <DataTable
        data={data ?? []}
        loading={isLoading}
        rowKey={(post: Post) => post.id}
        emptyMessage="No posts available"
        columns={[
          { key: "id", header: "ID" },
          { key: "userId", header: "User ID" },
          { key: "title", header: "Title" },
          { key: "body", header: "Body" },
        ]}
      />
    </div>
  );
}