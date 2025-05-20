import { FC } from "react";
import { useContext } from 'react';
import Link from "next/link";
import { styled } from "@mui/material";
import { CustomizerContext } from "@/app/context/customizerContext";
import Image from "next/image";
import config from "@/app/context/config";

const AuthLogo = () => {
  const { isCollapse, isSidebarHover, activeDir, activeMode } = useContext(CustomizerContext);

  const TopbarHeight = config.topbarHeight
  const LinkStyled = styled(Link)(() => ({
    height: TopbarHeight,
    width: isCollapse == "mini-sidebar" && !isSidebarHover ? '40px' : '180px',
    overflow: "hidden",
    display: "block",
  }));

  if (activeDir === "ltr") {
    return (
      <LinkStyled href="/">
        {activeMode === "dark" ? (
          <Image
            src="/images/logos/light-logo.svg"
            alt="logo"
            height={TopbarHeight}
            width={174}
            priority
          />
        ) : (
          <Image
            src={"/images/logos/dark-logo.svg"}
            alt="logo"
            height={TopbarHeight}
            width={174}
            priority
          />
        )}
      </LinkStyled>
    );
  }

  return (
    <LinkStyled href="/">
      {activeMode === "dark" ? (
        <Image
          src="/images/logos/light-rtl-logo.svg"
          alt="logo"
          height={TopbarHeight}
          width={174}
          priority
        />
      ) : (
        <Image
          src="/images/logos/dark-logo.svg"
          alt="logo"
          height={TopbarHeight}
          width={174}
          priority
        />
      )}
    </LinkStyled>
  );
};

export default AuthLogo;

