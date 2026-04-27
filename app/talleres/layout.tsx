import Header from "@/app/components/layout/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Header>{children}</Header>;
}
