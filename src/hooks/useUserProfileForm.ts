import { useState } from "react";
import { User } from "../interfaces/user";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import useAlert from "./useAlert";

const useUserProfileForm = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState<User>({
    _id: user?._id ?? "",
    name: user?.name ?? "",
    surname: user?.surname ?? "",
    email: user?.email ?? "",
    address: user?.address ?? "",
    postalcode: user?.postalcode ?? "",
    phone1: user?.phone1 ?? "",
    role: user?.role ?? "guest",
    isActive: user?.isActive ?? false,
    password: "",
  });

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
      showAlert("error", t("swal_title_error"), t("swal_fields_required"));
      return;
    }

    try {
      await axios.put(`/users/${user?._id}`, formData);
      showAlert("success", t("swal_title_success"), t("swal_user_updated_ok"));
    } catch (error) {
      console.error("Error updating user:", error);
      showAlert(
        "error",
        t("swal_title_error"),
        t("swal_error_updating_user_text")
      );
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
  };
};

export default useUserProfileForm;
