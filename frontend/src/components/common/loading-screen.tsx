import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export const LoadingScreen = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-4"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Loader2 className="h-12 w-12 text-primary" />
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm text-muted-foreground"
                >
                    Yükleniyor...
                </motion.p>
            </motion.div>
        </div>
    );
};
