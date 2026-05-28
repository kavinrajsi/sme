/* eslint-disable @next/next/no-async-client-component */
import { RootLayout } from "@payloadcms/next/layouts";
import { importMap } from "./admin/importMap.js";
import config from "../../payload.config.js";

import "./custom.scss";

const Layout = ({ children }) => (
  <RootLayout config={config} importMap={importMap}>
    {children}
  </RootLayout>
);

export default Layout;
