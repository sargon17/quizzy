import React from "react";

import { Link } from "react-router-dom";

import "../scss/style.scss";

export default function Card({
  linkPath,
  overTitle,
  title,
  subTitle,
  text,
  image,
  linkText,
  passingRate,
  id,
}) {
  return (
    <>
      <li className="card card-horizontal">
        {image && (
          <div className="card-cover">
            <img src={image} />
          </div>
        )}
        <div className="card-body">
          <div className="card-content">
            <div className=" flex justify-between items-center ">
              {overTitle && <p className="card-overTitle">By: {overTitle}</p>}
              {passingRate > 0 && (
                <p
                  className={
                    passingRate > 50
                      ? "card-stat card-stat--positive"
                      : "card-stat card-stat--negative"
                  }
                >
                  <span>Passing Rate: </span>
                  {passingRate}%
                </p>
              )}
            </div>
            {title && <h4 className="card-title">{title}</h4>}
            {subTitle && <p className="card-subTitle">{subTitle}</p>}
            {text && <p className="card-text">{text}</p>}
          </div>
          <div className="card-footer flex justify-end">
            {linkPath && id && (
              <Link
                className="btn btn-primary-outlined btn-round-s"
                to={`${linkPath}${id}`}
              >
                {linkText ? linkText : "GO"}
              </Link>
            )}
          </div>
        </div>
      </li>
    </>
  );
}
