import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";
import { User } from "../interfaces/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const UserProfile: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [formData, setFormData] = useState<User>({
    _id: user?._id || "",
    name: user?.name || "",
    surname: user?.surname || "",
    email: user?.email || "",
    address: user?.address || "",
    postalcode: user?.postalcode || "",
    phone1: user?.phone1 || "",
    role: user?.role || "guest",
    isActive: user?.isActive || false,
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.surname ||
      !formData.email ||
      !formData.role
    ) {
      Swal.fire({
        title: t("swal_title_error"),
        text: t("swal_fields_required"),
        icon: "error",
        confirmButtonText: t("swal_confirm_button"),
      });
      return;
    }

    try {
      await axios.put(`/users/${user?._id}`, formData);
      Swal.fire({
        title: t("swal_title_success"),
        text: t("swal_user_updated_ok"),
        icon: "success",
        confirmButtonText: t("swal_accept_button"),
      });
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        title: t("swal_title_error"),
        text: t("swal_error_updating_user_text"),
        icon: "error",
        confirmButtonText: t("swal_accept_button"),
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-2"> </div>
        <div className="col-md-8">
          <div className="card p-4">
            <h2>{t("user_profile_title")}</h2>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col">
                  <label className="form-label">{t("form_name")} *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col">
                  <label className="form-label">{t("form_surname")} *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="row">
                  <div className="col">
                    <label className="form-label">{t("email")} *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col">
                    <label className="form-label">{t("form_address")}</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <div className="row">
                  <div className="col">
                    <label className="form-label">{t("form_postalcode")}</label>
                    <input
                      type="text"
                      className="form-control"
                      name="postalcode"
                      value={formData.postalcode}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col">
                    <label className="form-label">{t("form_phone")}</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone1"
                      value={formData.phone1}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="row">
                  {user?.role === "admin" && (
                    <div className="col">
                      <label className="form-label">{t("form_role")} *</label>
                      <select
                        className="form-select"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      >
                        <option value="admin">{t("form_role_admin")}</option>
                        <option value="doctor">{t("form_role_doctor")}</option>
                        <option value="guest">{t("form_role_guest")}</option>
                      </select>
                    </div>
                  )}
                  <div className="col">
                    <label className="form-label">
                      {t("form_change_password")}
                    </label>
                    <div className="input-group">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      >
                        <FontAwesomeIcon
                          icon={passwordVisible ? faEyeSlash : faEye}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                {t("form_button_update")}
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-2"> </div>
      </div>
    </div>
  );
};

export default UserProfile;
