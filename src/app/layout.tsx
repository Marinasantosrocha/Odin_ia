import React from "react";
import MyApp from "./app";
import NextTopLoader from 'nextjs-toploader';
import "./global.css";
import { CustomizerContextProvider } from "@/app/context/customizerContext";


export const metadata = {
  title: "MaterialPro Main Demo",
  description: "Material Main kit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextTopLoader color="#43CED7" />
        <CustomizerContextProvider>
          <MyApp>{children}</MyApp>
        </CustomizerContextProvider>
      </body>
    </html>
  );
}
