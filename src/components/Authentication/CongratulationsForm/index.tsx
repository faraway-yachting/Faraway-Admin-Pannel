"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import Button from "@/common/Button";

const CongratulationsForm: React.FC = () => {

    const router = useRouter();
    const formik = useFormik({
        initialValues: {
        },
        onSubmit: async () => {
            router.push("/");
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-5 sm:flex sm:flex-col sm:justify-center">
            <h2 className="text-[#0080A7] text-[27px] font-bold capitalize">Congratulations!</h2>
            <p className="text-[#222222] font-inter font-medium text-[14px]">Your password has been successfully reset! You&apos;re all set to continue your journey.</p>
            <Button type="submit">Back to sign in</Button>
        </form>
    );
};

export default CongratulationsForm;