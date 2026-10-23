import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import DataTable from "../components/DataTable";
import type { User } from "../types";

const userSchema = z.object({
  firstName: z
    .string()
    .min(3, "First name must be at least 3 characters")
    .max(10, "First name must be at most 10 characters"),
  lastName: z
    .string()
    .min(3, "Last name must be at least 3 characters")
    .max(10, "Last name must be at most 10 characters")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Enter a valid email address"),
  mobile: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  address: z
    .string()
    .max(50, "Address must be at most 50 characters")
    .optional()
    .or(z.literal("")),
});

type UserFormValues = z.infer<typeof userSchema>;

interface Props {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export default function UserFormPage({
  users,
  setUsers,
  onEdit,
  onDelete,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      address: "",
    },
  });

  const onSubmit = (values: UserFormValues) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      firstName: values.firstName,
      lastName: values.lastName || undefined,
      email: values.email,
      mobile: values.mobile,
      address: values.address || undefined,
    };

    setUsers((prevUsers) => [newUser, ...prevUsers]);
    reset();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>User Management</h1>
        <Link className="btn primary" to="/posts">
          API Posts
        </Link>
      </div>

      <form className="form-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="firstName">First Name *</label>
            <input id="firstName" {...register("firstName")} />
            {errors.firstName && (
              <span className="error">{errors.firstName.message}</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="lastName">Last Name</label>
            <input id="lastName" {...register("lastName")} />
            {errors.lastName && (
              <span className="error">{errors.lastName.message}</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="email">Email *</label>
            <input id="email" type="email" {...register("email")} />
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="mobile">Mobile *</label>
            <input
              id="mobile"
              inputMode="numeric"
              maxLength={10}
              {...register("mobile")}
            />
            {errors.mobile && (
              <span className="error">{errors.mobile.message}</span>
            )}
          </div>

          <div className="field full-width">
            <label htmlFor="address">Address</label>
            <input id="address" {...register("address")} />
            {errors.address && (
              <span className="error">{errors.address.message}</span>
            )}
          </div>
        </div>

        <button className="btn primary submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Add User"}
        </button>
      </form>

      <DataTable
        data={users}
        rowKey={(user) => user.id}
        emptyMessage="No users available"
        columns={[
          { key: "firstName", header: "First Name" },
          { key: "lastName", header: "Last Name" },
          { key: "email", header: "Email" },
          { key: "mobile", header: "Mobile" },
          { key: "address", header: "Address" },
          {
            key: "actions",
            header: "Actions",
            render: (user) => (
              <div className="action-buttons">
                <button
                  className="btn small primary"
                  onClick={() => onEdit(user)}
                >
                  Edit
                </button>

                <button
                  className="btn small danger"
                  onClick={() => onDelete(user.id)}
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}