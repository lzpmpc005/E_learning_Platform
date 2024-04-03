"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getAnalytics } from "@/actions/get-analytics";

import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";

interface AnalyticsData {
  name: string;
  total: number;
}

const AnalyticsPage = () => {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/auth/login");
    } else {
      getAnalytics(userId).then((analytics) => {
        setData(analytics.data);
        setTotalRevenue(analytics.totalRevenue);
        setTotalSales(analytics.totalSales);
      });
    }
  }, []);
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard label="Total Revenue" value={totalRevenue} shouldFormat />
        <DataCard label="Total Sales" value={totalSales} />
      </div>
      <Chart data={data} />
    </div>
  );
};

export default AnalyticsPage;
