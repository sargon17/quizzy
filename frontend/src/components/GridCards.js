import React from "react";

import { Link } from "react-router-dom";

import "../scss/style.scss";

export default function GridCards({
  Data,
  linkPath,
  subTitle,
  title,
  underTitle,
  text,
  image,
  linkText,
}) {
  return (
    <div>
      <ul className="flex flex-wrap justify-center gap-2 ">
        {Data &&
          Data.map((d) => {
            return (
              <li className="card card-horizontal" key={d.id}>
                <div className="card-cover">
                  <img src={d.imagePath} />
                </div>
                <div className="card-body">
                  <div className="card-content">
                    <h4 className="card-title">{d.title}</h4>
                  </div>
                  <div className="card-footer flex justify-end">
                    <Link
                      className="btn btn-primary-outlined btn-round-s"
                      to={`${linkPath}${d.id}`}
                    >
                      GO
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
