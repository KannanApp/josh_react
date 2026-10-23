import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import type { User } from "../types";

const editUserSchema = z.object({
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

type EditUserValues = z.infer<typeof editUserSchema>;

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const selectedUser = (location.state as { user?: User } | null)?.user;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditUserValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      address: "",
    },
  });

  useEffect(() => {
    if (selectedUser) {
      reset({
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName ?? "",
        email: selectedUser.email,
        mobile: selectedUser.mobile,
        address: selectedUser.address ?? "",
      });
    }
  }, [selectedUser, reset]);

  const onSubmit = (values: EditUserValues) => {
    if (!selectedUser) return;

    const updatedUser: User = {
      ...selectedUser,
      firstName: values.firstName,
      lastName: values.lastName || undefined,
      email: values.email,
      mobile: values.mobile,
      address: values.address || undefined,
    };

    const storedUsers = localStorage.getItem("users");
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    navigate("/");
  };

  if (!selectedUser) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Edit User</h1>
          <Link className="btn secondary" to="/">
            Back
          </Link>
        </div>

        <div className="form-card">
          <p>User data not found. Please go back and click Edit again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Edit User</h1>
        <Link className="btn secondary" to="/">
          Back
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
          {isSubmitting ? "Updating..." : "Update User"}
        </button>
      </form>
    </div>
  );
}