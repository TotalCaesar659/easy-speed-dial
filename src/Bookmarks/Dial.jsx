import { observer } from "mobx-react-lite";
import { useLayoutEffect, useRef, useState } from "react";

import { contextMenu } from "#stores/useContextMenu";
import { settings } from "#stores/useSettings";
import { dialColors } from "./dialColors";

export const Dial = observer(function Dial(props) {
  return (
    <a
      href={props.type === "bookmark" ? props.url : `#${props.id}`}
      data-id={props.id}
      data-title={props.title}
      data-type={props.type}
      data-thumbnail={settings.dialImages[props.id] ? "" : null}
      rel={props.type === "bookmark" ? "noreferrer" : undefined}
      className="Link"
      target={
        props.type === "bookmark" && settings.newTab ? "_blank" : undefined
      }
      onContextMenu={contextMenu.openContextMenu}
    >
      <div
        className="Box"
        style={{
          background: settings.dialImages[props.id]
            ? `${settings.dialColors[props.id] || dialColors(props.name)} url("${settings.dialImages[props.id]}") center/cover no-repeat`
            : `${settings.dialColors[props.id] || dialColors(props.name)}`,
          textShadow:
            props.type !== "folder" ? "2px 1px 0 rgb(33,33,33,0.7)" : "none",
        }}
      >
        {!settings.dialImages[props.id] &&
          (props.type === "bookmark" ? (
            <div>
              <Name
                {...{
                  name: settings.switchTitle
                    ? props.title
                      ? [props.title]
                      : [props.name.join(".")]
                    : props.name,
                }}
              />
            </div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="folder"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M9.17 6l2 2H20v10H4V6h5.17M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
            </svg>
          ))}
      </div>
      <Title {...{ title: props.title, name: props.name }} />
    </a>
  );
});

function Name(props) {
  return props.name.length === 1 ? (
    <Domain {...{ title: true }}>{props.name.join(".")}</Domain>
  ) : props.name.length === 3 && props.name[0].length < props.name[1].length ? (
    <>
      <Small align="left" key={props.name[0]}>
        {props.name[0]}
      </Small>
      <Domain key={props.name[1]}>{props.name[1]}</Domain>
      <Small align="right" key={props.name[2]}>
        {props.name[2]}
      </Small>
    </>
  ) : props.name.length === 2 ? (
    <>
      <Domain padding={true} key={props.name[0]}>
        {props.name[0]}
      </Domain>
      <Small align="right" key={props.name[1]}>
        {props.name[1]}
      </Small>
    </>
  ) : props.name[0].length > props.name[1].length ||
    props.name[0].length === props.name[1].length ? (
    <>
      <Domain padding={true}>{props.name[0]}</Domain>
      <Small align="right">{props.name.slice(1).join(".")}</Small>
    </>
  ) : (
    <>
      <Small align="left">{props.name[0]}</Small>
      <Domain>{props.name[1]}</Domain>
      <Small align="right">{props.name.slice(2).join(".")}</Small>
    </>
  );
}

function Small(props) {
  return (
    <div
      className="Small"
      style={{
        "--name-align": props.align,
      }}
    >
      {props.children}
    </div>
  );
}

function Domain(props) {
  const [scale, setScale] = useState();
  const domainRef = useRef();
  useLayoutEffect(() => {
    const domainWidth = domainRef.current.offsetWidth;
    const domainHeight = domainRef.current.offsetHeight;
    if (domainHeight > "120") {
      setScale(120 / domainHeight);
    } else if (domainWidth > "180") {
      setScale(180 / domainWidth);
    }
  }, []);
  return (
    <div
      ref={domainRef}
      className="Domain"
      style={{
        "--name-line-height": props.title ? "26px" : "16px",
        "--name-white-space": props.title ? "initial" : "nowrap",
        "--name-padding": props.title
          ? "0"
          : props.padding
            ? "18px 0 3px"
            : "3px 0",
        "--name-transform": scale ? `scale(${scale})` : "initial",
      }}
    >
      {props.children}
    </div>
  );
}

const Title = observer(function Title(props) {
  if (!settings.showTitle) return;

  return (
    <div className="Title">
      <div className="title">
        {settings.switchTitle || !props.title
          ? props.name.join(".")
          : props.title}
      </div>
    </div>
  );
});
