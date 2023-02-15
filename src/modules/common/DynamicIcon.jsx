import React, { CSSProperties, SVGAttributes } from "react";
import { IconContext } from "react-icons";
import loadable from "@loadable/component";
import Loader from "react-js-loader";
import ErrorBoundary from "./ErrorBoundary";

export const DynamicIcon = ({ ...props }) => {
  // const [library, iconComponent] = props.icon.split("/");
  const iconComponent = props.icon;
  let library = props.icon.substr(0, 2);
  if (library === "Io") {
    library = "io5";
  }
  if (library === "Vs") {
    library = "Vsc";
  }

  if (!library || !iconComponent) return <div>Could Not Find Icon</div>;

  const lib = library.toLowerCase();
  const Icon = loadable(() => import(`react-icons/${lib}/index.js`), {
    fallback: <Loader
    type="box-rotate-x"
    bgColor={"#32E0A1"}
    color={"#fff"}
    size={50}
  />,
    resolveComponent: (el) => {
      return el[iconComponent]
    }
  },
  );

  const value = {
    color: props.color,
    size: props.size,
    className: props.className,
    style: props.style,
    attr: props.attr
  };

  return (
    <ErrorBoundary type="icon">
    <IconContext.Provider value={value}>
      <Icon />
    </IconContext.Provider>
    </ErrorBoundary>
  );
};

export default DynamicIcon;
