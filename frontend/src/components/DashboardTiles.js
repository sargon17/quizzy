import React from "react";

export default function DashboardTiles() {
  return (
    <div className="dashboard-tiles grid grid-cols-4 grid-rows-5 gap-5 mr-5">
      <div className="tile col-span-1 row-span-1 row-start-1"></div>
      <div className="tile col-span-1 row-span-1 row-start-2"></div>
      <div className="tile col-start-2 col-end-4 row-start-1 row-end-3"></div>
      <div className="tile col-span-1 row-start-1 row-span-4"></div>
      <div className="tile col-start-1 col-span-2 row-start-3 row-span-1"></div>
      <div className="tile col-span-1 row-span-1 row-start-3"></div>
      <div className="tile col-span-3 row-span-2 row-start-4"></div>
      <div className="tile col-span-1 row-span-1 row-start-5"></div>
    </div>
  );
}
