import { Metadata } from "next";

export const metadata: Metadata = {
    title: "LifeGear",
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