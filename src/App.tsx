import { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import UserFormPage from "./pages/UserFormPage";
import ConfirmDialog from "./components/ConfirmDialog";
import type { User } from "./types";

export default function App() {
  return (
    <div className="app-shell">
      <nav className="navbar">
        <Link to="/" className="brand">
          Josh
        </Link>

        <div className="nav-links">
          <Link to="/">Users</Link>
          <Link to="/posts">Posts</Link>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export function UserListWithDelete() {
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem("users");
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const confirmDelete = () => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== deleteId)
    );

    setDeleteId(null);
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  return (
    <>
      <UserFormPage
        users={users}
        setUsers={setUsers}
        onEdit={(user) =>
          navigate(`/users/${user.id}/edit`, {
            state: { user },
          })
        }
        onDelete={(id) => setDeleteId(id)}
      />

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete user"
        message="Are you sure you want to delete this user?"
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}