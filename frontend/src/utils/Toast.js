//use this functions for better error handaling
/*
when u want to use this don't forgot to add ToastContainer 
import { ToastContainer } from "react-toastify";
component in page check createGroup for better understanding
*/
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
export const showErrorToast = (message) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    });
};

export const showSuccessToast = (message) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    });
};