"use client";

import { Navbar } from "@/app/components/layout/Navbar";
import { Providers } from "@/app/utils/providers";
import { Toaster } from "react-hot-toast";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { ContractWrapper } from "@/app/contexts/ContractContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <div>
            <Providers>
                <ContractWrapper>
                    <div className="bg-gray-900 h-full flex flex-col">
                        <Navbar />
                        <main className="transition-all duration-300 ease-in-out ml-0 flex-1 overflow-auto">
                            <div className="mt-16 p-4 md:p-4">{children}</div>
                        </main>
                    </div>
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