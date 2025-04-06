"use client"

import { useOrganization } from "@clerk/nextjs";

import { EmptyOrg } from "./_components/EmptyOrg";
import { BoardList } from "./_components/BoardList";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { devLog } from "@/lib/utils";

type DashboardPageProps = {
  searchParams: {
    search?: string;
    favorites?: string;
  };
};

const DashboardPage = ({ searchParams }: DashboardPageProps) => {
  const { organization } = useOrganization();

  // devLog("searchParams",searchParams)

  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6">

      {!organization ? (
        <EmptyOrg />
      ) : (
        <BoardList orgId={organization.id} query={searchParams} />
      )}
    </div>
  );
};

export default DashboardPage;
