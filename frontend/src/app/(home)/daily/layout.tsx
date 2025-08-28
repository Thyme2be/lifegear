import { Metadata } from "next";

export const metadata: Metadata = {
    title: "LifeGear | Daily",
    description: "Time management for event in Engineering faculty",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section
        >
            {children}
        </section>
    );
}