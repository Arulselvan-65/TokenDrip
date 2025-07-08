"use client";

import { Navbar } from "@/app/components/layout/Navbar";
import { Providers } from "@/app/utils/providers";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import {ContractWrapper} from "@/app/contexts/ContractContext";

interface NavbarProps {
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
    walletAddress: string;
    networkStatus: "connected" | "disconnected";
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    walletAddress: string;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="en">
        <body>
        <div className="bg-black text-white font-sans relative">
            <Providers>
            <ContractWrapper>
                        <div className="bg-gray-900 min-h-screen">
                            <Navbar/>
                            <main className={"transition-all duration-300 ease-in-out ml-0"}>
                                <div className="mt-12 p-4 md:p-8">{children}</div>
                            </main>
                        </div>

                    <ToastContainer
                        limit={1}
                        position="top-right"
                        className="toastContainer"
                    />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 1000,
                            style: {
                                background: "#1f2937",
                                color: "#fff",
                                border: "1px solid rgba(139, 92, 246, 0.1)",
                            },
                            success: {
                                style: {
                                    background: "#1f2937",
                                    border: "1px solid rgba(34, 197, 94, 0.2)",
                                },
                                iconTheme: {
                                    primary: "#22c55e",
                                    secondary: "#1f2937",
                                },
                            },
                            error: {
                                style: {
                                    background: "#1f2937",
                                    border: "1px solid rgba(239, 68, 68, 0.2)",
                                },
                                iconTheme: {
                                    primary: "#ef4444",
                                    secondary: "#1f2937",
                                },
                            },
                        }}
                    />
            </ContractWrapper>
        </Providers>
        </div>
        </body>
        </html>
    );
}