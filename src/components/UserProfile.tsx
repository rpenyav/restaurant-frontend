import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import useUserProfileForm from "../hooks/useUserProfileForm";
import usePasswordVisibility from "../hooks/usePasswordVisibility";

const UserProfile: React.FC = () => {
  const { t } = useTranslation();
  const { formData, handleChange, handleSubmit } = useUserProfileForm();
  const { passwordVisible, togglePasswordVisibility } = usePasswordVisibility();

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
                  {formData.role === "admin" && (
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
                        onClick={togglePasswordVisibility}
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
