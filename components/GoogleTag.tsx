"use client";

import React from "react";
import Script from "next/script";

const GoogleTag = () => {
  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=" />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

         gtag('config', '');
        `,
        }}
      />
    </>
  );
};

export default GoogleTag;
