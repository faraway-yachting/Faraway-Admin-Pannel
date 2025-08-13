"use client";

import Input from "@/common/Input";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import MailBox from "@/icons/MailBox";
import Lock from "@/icons/Lock";
import Button from "@/common/Button";
import { useDispatch } from "react-redux";
import { signinUser } from "@/lib/Features/Auth/authSlice";
import type { AppDispatch } from '@/lib/Store/store';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const SigninForm: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
            .required("Password is required"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm, setSubmitting, setFieldError }) => {
            try {
                const resultAction = await dispatch(signinUser({
                    email: values.email,
                    password: values.password
                }));

                if (signinUser.fulfilled.match(resultAction)) {
                    const message = resultAction.payload?.message;
                    toast.success(message, {
                        onClose: () => {
                            router.push("/dashboard");
                        },
                    });
                    resetForm();
                } else if (signinUser.rejected.match(resultAction)) {
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
            <form onSubmit={formik.handleSubmit}>
                <div className="px-6 sm:px-10 xl:px-12 space-y-3">
                    <Image 
                        src="/images/logo.png" 
                        alt="logo" 
                        width={552} 
                        height={210} 
                        className="w-[15rem] h-auto" 
                        priority
                    />
                    <h2 className="text-[#1E1E1E] text-[19px] font-bold font-plusjakarta">Anchor Your Dreams</h2>
                    <p className="font-plusjakarta font-medium text-[14px] text-[#1E1E1E]">Join a world of endless adventures — book your dream yacht or list your own and let the journey begin!</p>
                    <div className="space-y-1">
                        <label htmlFor="" className="text-[#012A50] font-plusjakarta font-bold text-[14px] mb-[12px] block">Email</label>
                        <Input
                            name="email"
                            type="email"
                            icon={<MailBox />}
                            placeholder="Your email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && !!formik.errors.email}
                        />
                        {formik.touched.email && formik.errors.email && (<p className="text-[#FF4234] text-sm">{formik.errors.email}</p>)}
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="" className="text-[#012A50] font-plusjakarta font-bold text-[14px] mb-[12px] block">Password</label>
                        <Input
                            name="password"
                            type="password"
                            icon={<Lock />}
                            placeholder="Enter password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && !!formik.errors.password}
                        />
                        {formik.touched.password && formik.errors.password && (<p className="text-[#FF4234] text-sm">{formik.errors.password}</p>)}
                    </div>
                    <div className="flex justify-between items-center mt-3 mb-3">
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#888888] font-normal font-plusjakarta">
                            <input
                                type="checkbox"
                                className="w-[14px] h-[14px] appearance-none cursor-pointer rounded-sm border border-[#888888] checked:bg-[#001B48] checked:border-[#001B48] checked:after:content-['✓'] after:text-white after:text-[10px] after:flex after:items-center after:justify-center"
                            />
                            Remember me
                        </label>
                        <Link
                            href="/forgotPassword"
                            className="text-[16px] cursor-pointer underline font-normal text-[#009AFF] font-plusjakarta"
                        >
                            Forget password?
                        </Link>
                    </div>
                    <Button
                        type="submit"
                        className={`w-full ${formik.isSubmitting ? "bg-[#C3974C]" : "bg-[#001B48]"}`}
                        disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? "Loading..." : "Sign In"}
                    </Button>
                </div>
            </form>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};

export default SigninForm;