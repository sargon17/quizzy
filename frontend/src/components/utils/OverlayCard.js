import React from "react";

import useOnclickOutside from "react-cool-onclickoutside";

export default function OverlayCard({ children, open }) {
  const cardRef = useOnclickOutside(() => {
    open(false);
  });

  return (
    <div className="overlay-card">
      <div className="card" ref={cardRef}>
        {children}
      </div>
    </div>
  );
}
