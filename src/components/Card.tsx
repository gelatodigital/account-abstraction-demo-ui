import React from "react";

interface CardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = (props) => {
  return <div className="rounded-xl w-fit">{props.children}</div>;
};
