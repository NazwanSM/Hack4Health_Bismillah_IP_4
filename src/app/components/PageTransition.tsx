"use client";

import { motion } from "framer-motion";

const variants = {
    hidden: { opacity: 0, x: 0, y: 20 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -20 }
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ type: "linear", duration: 0.3 }}
        className="h-full"
        >
        {children}
        </motion.div>
    );
}