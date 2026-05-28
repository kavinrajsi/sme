import { NotFoundPage, generatePageMetadata } from "@payloadcms/next/views";
import { importMap } from "../importMap.js";
import config from "../../../../payload.config.js";

export const generateMetadata = ({ params, searchParams }) =>
  generatePageMetadata({ config, params, searchParams });

const NotFound = ({ params, searchParams }) =>
  NotFoundPage({ config, params, searchParams, importMap });

export default NotFound;
