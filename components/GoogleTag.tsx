"use client";

import React from "react";
import Script from "next/script";

const GoogleTag = () => {
  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-16763653327" />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

         gtag('config', 'AW-16763653327');
        `,
        }}
      />
    </>
  );
};

export default GoogleTag;
