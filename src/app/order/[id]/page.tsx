import type { Metadata } from "next";
import { OrderDetails } from "@/components/OrderDetails";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order ${id}`,
    description: "Your CodelyDev purchase confirmation and downloads.",
    robots: { index: false },
  };
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 sm:px-6">
      <OrderDetails id={id} />
    </div>
  );
}
