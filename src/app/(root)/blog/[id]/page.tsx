"use client"

import { useState } from "react";
import { use } from "react";
import BlogDetails from "@/components/Blog/Details";
import BlogUpdate from "@/components/Blog/Details/updateBlog";

const Blogs = ({ params }: { params: Promise<{ id: string }> }) => {
    const [showEditForm, setShowEditForm] = useState(false);
    const { id } = use(params);

    return (
        <div>
            {showEditForm ? (
                <BlogUpdate goToPrevTab={() => setShowEditForm(false)} id={id} />
            ) : (
                <BlogDetails id={id} goToNextTab={() => setShowEditForm(true)} />
            )}
        </div>
    );
};

export default Blogs;