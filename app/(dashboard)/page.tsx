"use client";

import { useOrganization } from "@clerk/nextjs";

import { EmptyOrg } from "./_components/BoardList/EmptyOrg";
import BoardList from "./_components/BoardList/BoardList";

const DashboardPage = () => {
  const { organization } = useOrganization();

  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? (
        <EmptyOrg />
      ) : (
        <BoardList orgId={organization.id} />
      )}
    </div>
  );
};

export default DashboardPage;
