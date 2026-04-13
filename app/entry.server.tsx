import * as Sentry from "@sentry/react-router";
import {nodeProfilingIntegration} from "@sentry/profiling-node";
import { createReadableStreamFromReadable } from "@react-router/node";
import { renderToPipeableStream } from "react-dom/server";
import { ServerRouter } from "react-router";

Sentry.init({
    dsn: "https://727a5446fdb402f4fc031cd590265efe@o4511145159491584.ingest.us.sentry.io/4511145162244096",
    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
    sendDefaultPii: true,
    // Enable logs to be sent to Sentry
    enableLogs: true,
    // Add our Profiling integration
    integrations: [nodeProfilingIntegration()],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for tracing.
    // We recommend adjusting this value in production
    // Learn more at
    // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#tracesSampleRate
    tracesSampleRate: 0.1,
    // Enable profiling for a percentage of sessions
    // Learn more at
    // https://docs.sentry.io/platforms/javascript/configuration/options/#profileSessionSampleRate
    profileSessionSampleRate: 0.1
});


const handleRequest = Sentry.createSentryHandleRequest({
 ServerRouter,
 renderToPipeableStream,
 createReadableStreamFromReadable,
});

export default handleRequest;

export const handleError = Sentry.createSentryHandleError({
 logErrors: false
});
