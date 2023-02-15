import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import SimpleBarJS from "./simplebar-core.esm";
// import './simplebar.css';

/* Deprecated
 * Hardcore this here until we can safely deprecated it.
 * Helper function to retrieve options from element attributes
 */
const getOptions = function (obj) {
  const options = Array.prototype.reduce.call(
    obj,
    (acc, attribute) => {
      const option = attribute.name.match(/data-simplebar-(.+)/);
      if (option) {
        const key = option[1].replace(/\W+(.)/g, (x, chr) => chr.toUpperCase());
        switch (attribute.value) {
          case "true":
            acc[key] = true;
            break;
          case "false":
            acc[key] = false;
            break;
          case undefined:
            acc[key] = true;
            break;
          default:
            acc[key] = attribute.value;
        }
      }
      return acc;
    },
    {}
  );
  return options;
};

const SimpleBar = React.forwardRef(
  ({ children, scrollableNodeProps = {}, tag = "div", ...otherProps }, ref) => {
    const RootTag = tag;
    let instance;
    let scrollableNodeRef = useRef();
    const elRef = useRef();
    const contentNodeRef = useRef();
    let options = {};
    let rest = {};
    let deprecatedOptions = [];

    Object.keys(otherProps).forEach((key) => {
      if (
        Object.prototype.hasOwnProperty.call(SimpleBarJS.defaultOptions, key)
      ) {
        options[key] = otherProps[key];
      } else if (
        key.match(/data-simplebar-(.+)/) &&
        key !== "data-simplebar-direction"
      ) {
        deprecatedOptions.push({
          name: key,
          value: otherProps[key],
        });
      } else {
        rest[key] = otherProps[key];
      }
    });

    if (deprecatedOptions.length) {
      console.warn(`simplebar-react: this way of passing options is deprecated. Pass it like normal props instead:
        'data-simplebar-auto-hide="false"' —> 'autoHide="false"'
      `);
    }

    useEffect(() => {
      scrollableNodeRef = scrollableNodeProps.ref || scrollableNodeRef;

      if (elRef.current) {
        instance = new SimpleBarJS(elRef.current, {
          ...getOptions(deprecatedOptions),
          ...options,
          ...(scrollableNodeRef && {
            scrollableNode: scrollableNodeRef.current,
          }),
          ...(contentNodeRef.current && {
            contentNode: contentNodeRef.current,
          }),
        });

        if (ref) {
          ref.current = instance;
        }
      }

      return () => {
        instance.unMount();
        instance = null;
      };
    }, []);

    return (
      <RootTag ref={elRef} data-weconnect-simplebar {...rest}>
        <div className="weconnect-simplebar-wrapper">
          <div className="weconnect-simplebar-height-auto-observer-wrapper">
            <div className="weconnect-simplebar-height-auto-observer" />
          </div>
          <div className="weconnect-simplebar-mask">
            <div className="weconnect-simplebar-offset">
              {typeof children === "function" ? (
                children({ scrollableNodeRef, contentNodeRef })
              ) : (
                <div
                  {...scrollableNodeProps}
                  className={`weconnect-simplebar-content-wrapper${
                    scrollableNodeProps.className
                      ? ` ${scrollableNodeProps.className}`
                      : ""
                  }`}
                >
                  <div className="weconnect-simplebar-content">{children}</div>
                </div>
              )}
            </div>
          </div>
          <div className="weconnect-simplebar-placeholder" />
        </div>
        <div className="weconnect-simplebar-track weconnect-simplebar-horizontal">
          <div className="weconnect-simplebar-scrollbar" />
        </div>
        <div className="weconnect-simplebar-track weconnect-simplebar-vertical">
          <div className="weconnect-simplebar-scrollbar" />
        </div>
      </RootTag>
    );
  }
);

SimpleBar.displayName = "SimpleBar";

SimpleBar.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  scrollableNodeProps: PropTypes.object,
  tag: PropTypes.string,
};

export default SimpleBar;
