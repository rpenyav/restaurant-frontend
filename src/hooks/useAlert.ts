import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const useAlert = () => {
  const { t } = useTranslation();

  const showAlert = (
    icon: "success" | "error",
    title: string,
    text: string
  ) => {
    Swal.fire({
      icon,
      title: t(title),
      text: t(text),
      confirmButtonText: t("swal_accept_button"),
    });
  };

  const showSuccessAlert = (title: string, text: string) => {
    showAlert("success", title, text);
  };

  const showErrorAlert = (title: string, text: string) => {
    showAlert("error", title, text);
  };

  const showConfirmAlert = (
    title: string,
    text: string,
    onConfirm: () => void
  ) => {
    Swal.fire({
      title: t(title),
      text: t(text),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("swal_si_eliminar"),
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
        Swal.fire(
          t("swal_eliminado"),
          t("swal_pedido_ha_sido_eliminado"),
          "success"
        );
      }
    });
  };

  return { showAlert, showSuccessAlert, showErrorAlert, showConfirmAlert };
};

export default useAlert;
