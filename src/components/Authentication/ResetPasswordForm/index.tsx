"use client";

import Input from "@/common/Input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/common/Button";
import Lock from "@/icons/Lock";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { resetPassword } from "@/lib/Features/Auth/authSlice";
import type { AppDispatch } from '@/lib/Store/store';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const ResetPasswordForm: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const validationSchema = Yup.object({
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), undefined], "Passwords must match")
            .required("Confirm Password is required"),
    });

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema,
        onSubmit: async (values, { resetForm, setSubmitting, setFieldError }) => {

            const storedEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
            if (!storedEmail) {
                setFieldError("password", "Email not found. Please try again.");
                setSubmitting(false);
                return;
            }
            try {
                const resultAction = await dispatch(resetPassword({
                    email: storedEmail,
                    newPassword: values.password,
                }));

                if (resetPassword.fulfilled.match(resultAction)) {
                    const message = resultAction.payload?.message;
                    toast.success(message, {
                        onClose: () => {
                            router.push("/congratulations");
                        },
                    });
                    resetForm();
                    localStorage.removeItem("userEmail");
                } else if (resetPassword.rejected.match(resultAction)) {
                    const errorPayload = resultAction.payload as { error: { message: string } };
                    const errorMessage = errorPayload?.error?.message || "Something went wrong.";
                    toast.error(errorMessage);
                }
            } catch (error) {
                console.error("Login error:", error);
                setFieldError("password", "An unexpected error occurred");
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <form onSubmit={formik.handleSubmit}>
                <div className="px-6 sm:px-10 xl:px-12 space-y-3">
                    <div className="space-y-3">
                        <Image 
                        src="/images/logo.png" 
                        alt="logo" 
                        width={552} 
                        height={210} 
                        className="w-[15rem] h-auto" 
                        priority
                    />
                        <h2 className="text-[#1E1E1E] text-[19px] font-bold font-plusjakarta">Anchor Your Dreams</h2>
                        <h2 className="text-[#012A50] text-[24px] font-bold font-plusjakarta">
                            Reset Your Password
                        </h2>
                        <p className="text-[14px] font-medium text-[#888888] font-plusjakarta">
                            Enter your new password below to reset your access. Make sure it&apos;s strong and secure for a smooth sailing experience.
                        </p>
                    </div>
                    <div className="space-y-6">
                        <label htmlFor="" className="text-[#012A50] font-plusjakarta font-bold text-[14px] mb-[12px] block">Enter New Password</label>
                        <div className="space-y-1">
                            <Input
                                name="password"
                                type="password"
                                icon={<Lock />}
                                placeholder="Your Password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && !!formik.errors.password}
                            />
                            {formik.touched.password && formik.errors.password && (<p className="text-[#FF4234] text-sm">{formik.errors.password}</p>)}
                        </div>
                        <label htmlFor="" className="text-[#012A50] font-plusjakarta font-bold text-[14px] mb-[12px] block">Confirm Password</label>
                        <div className="space-y-1">
                            <Input
                                name="confirmPassword"
                                type="password"
                                icon={<Lock />}
                                placeholder="Confirm password"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (<p className="text-[#FF4234] text-sm">{formik.errors.confirmPassword}</p>)}
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className={`w-full ${formik.isSubmitting ? "bg-[#C3974C]" : "bg-[#001B48]"}`}
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? "Loading..." : "Reset Password"}
                    </Button>
                </div>
            </form>
        </>
    );
};

export default ResetPasswordForm;