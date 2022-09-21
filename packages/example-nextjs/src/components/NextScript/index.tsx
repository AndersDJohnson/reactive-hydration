import React from "react";
import type { ScriptProps } from "next/dist/client/script";
import type { HtmlProps } from "next/dist/shared/lib/html-context";

import { BuildManifest, getPageFiles } from "next/dist/server/get-page-files";
import { htmlEscapeJsonString } from "next/dist/server/htmlescape";
import { HtmlContext } from "next/dist/shared/lib/html-context";
import isError from "next/dist/lib/is-error";

export type OriginProps = {
  nonce?: string;
  crossOrigin?: string;
  children?: React.ReactNode;
};

type DocumentFiles = {
  sharedFiles: readonly string[];
  pageFiles: readonly string[];
  allFiles: readonly string[];
};

function getDocumentFiles(
  buildManifest: BuildManifest,
  pathname: string,
  inAmpMode: boolean
): DocumentFiles {
  const sharedFiles: readonly string[] = getPageFiles(buildManifest, "/_app");
  const pageFiles: readonly string[] =
    process.env.NEXT_RUNTIME !== "edge" && inAmpMode
      ? []
      : getPageFiles(buildManifest, pathname);

  return {
    sharedFiles,
    pageFiles,
    allFiles: [...new Set([...sharedFiles, ...pageFiles])],
  };
}

function getPolyfillScripts(context: HtmlProps, props: OriginProps) {
  // polyfills.js has to be rendered as nomodule without async
  // It also has to be the first script to load
  const {
    assetPrefix,
    buildManifest,
    devOnlyCacheBusterQueryString,
    disableOptimizedLoading,
    crossOrigin,
  } = context;

  return buildManifest.polyfillFiles
    .filter(
      (polyfill) => polyfill.endsWith(".js") && !polyfill.endsWith(".module.js")
    )
    .map((polyfill) => (
      <script
        key={polyfill}
        defer={!disableOptimizedLoading}
        nonce={props.nonce}
        crossOrigin={props.crossOrigin || crossOrigin}
        noModule={true}
        src={`${assetPrefix}/_next/${polyfill}${devOnlyCacheBusterQueryString}`}
      />
    ));
}

function hasComponentProps(child: any): child is React.ReactElement {
  return !!child && !!child.props;
}

function getDynamicChunks(
  context: HtmlProps,
  props: OriginProps,
  files: DocumentFiles
) {
  const {
    dynamicImports,
    assetPrefix,
    isDevelopment,
    devOnlyCacheBusterQueryString,
    disableOptimizedLoading,
    crossOrigin,
  } = context;

  return dynamicImports.map((file) => {
    if (!file.endsWith(".js") || files.allFiles.includes(file)) return null;

    // CUSTOM LINE:
    if (/\/chunks\/(context|component)-/.test(file)) return null;

    return (
      <script
        async={!isDevelopment && disableOptimizedLoading}
        defer={!disableOptimizedLoading}
        key={file}
        src={`${assetPrefix}/_next/${encodeURI(
          file
        )}${devOnlyCacheBusterQueryString}`}
        nonce={props.nonce}
        crossOrigin={props.crossOrigin || crossOrigin}
      />
    );
  });
}

function getScripts(
  context: HtmlProps,
  props: OriginProps,
  files: DocumentFiles
) {
  const {
    assetPrefix,
    buildManifest,
    isDevelopment,
    devOnlyCacheBusterQueryString,
    disableOptimizedLoading,
    crossOrigin,
  } = context;

  const normalScripts = files.allFiles.filter((file) => file.endsWith(".js"));
  const lowPriorityScripts = buildManifest.lowPriorityFiles?.filter((file) =>
    file.endsWith(".js")
  );

  return [...normalScripts, ...lowPriorityScripts].map((file) => {
    // CUSTOM LINE:
    if (/\/chunks\/(context|component)-/.test(file)) return null;

    return (
      <script
        key={file}
        src={`${assetPrefix}/_next/${encodeURI(
          file
        )}${devOnlyCacheBusterQueryString}`}
        nonce={props.nonce}
        async={!isDevelopment && disableOptimizedLoading}
        defer={!disableOptimizedLoading}
        crossOrigin={props.crossOrigin || crossOrigin}
      />
    );
  });
}

function getPreNextWorkerScripts(context: HtmlProps, props: OriginProps) {
  const { assetPrefix, scriptLoader, crossOrigin, nextScriptWorkers } = context;

  // disable `nextScriptWorkers` in edge runtime
  if (!nextScriptWorkers || process.env.NEXT_RUNTIME === "edge") return null;

  try {
    let {
      partytownSnippet,
      // @ts-ignore: Prevent webpack from processing this require
    } = __non_webpack_require__("@builder.io/partytown/integration"!);

    const children = Array.isArray(props.children)
      ? props.children
      : [props.children];

    // Check to see if the user has defined their own Partytown configuration
    const userDefinedConfig = children.find(
      (child) =>
        hasComponentProps(child) &&
        child?.props?.dangerouslySetInnerHTML?.__html.length &&
        "data-partytown-config" in child.props
    );

    return (
      <>
        {!userDefinedConfig && (
          <script
            data-partytown-config=""
            dangerouslySetInnerHTML={{
              __html: `
            partytown = {
              lib: "${assetPrefix}/_next/static/~partytown/"
            };
          `,
            }}
          />
        )}
        <script
          data-partytown=""
          dangerouslySetInnerHTML={{
            __html: partytownSnippet(),
          }}
        />
        {(scriptLoader.worker || []).map((file: ScriptProps, index: number) => {
          const {
            strategy,
            src,
            children: scriptChildren,
            dangerouslySetInnerHTML,
            ...scriptProps
          } = file;

          let srcProps: {
            src?: string;
            dangerouslySetInnerHTML?: {
              __html: string;
            };
          } = {};

          if (src) {
            // Use external src if provided
            srcProps.src = src;
          } else if (
            dangerouslySetInnerHTML &&
            dangerouslySetInnerHTML.__html
          ) {
            // Embed inline script if provided with dangerouslySetInnerHTML
            srcProps.dangerouslySetInnerHTML = {
              __html: dangerouslySetInnerHTML.__html,
            };
          } else if (scriptChildren) {
            // Embed inline script if provided with children
            srcProps.dangerouslySetInnerHTML = {
              __html:
                typeof scriptChildren === "string"
                  ? scriptChildren
                  : Array.isArray(scriptChildren)
                  ? scriptChildren.join("")
                  : "",
            };
          } else {
            throw new Error(
              "Invalid usage of next/script. Did you forget to include a src attribute or an inline script? https://nextjs.org/docs/messages/invalid-script"
            );
          }

          return (
            <script
              {...srcProps}
              {...scriptProps}
              type="text/partytown"
              key={src || index}
              nonce={props.nonce}
              data-nscript="worker"
              crossOrigin={props.crossOrigin || crossOrigin}
            />
          );
        })}
      </>
    );
  } catch (err) {
    if (isError(err) && err.code !== "MODULE_NOT_FOUND") {
      console.warn(`Warning: ${err.message}`);
    }
    return null;
  }
}

function getPreNextScripts(context: HtmlProps, props: OriginProps) {
  const { scriptLoader, disableOptimizedLoading, crossOrigin } = context;

  const webWorkerScripts = getPreNextWorkerScripts(context, props);

  const beforeInteractiveScripts = (scriptLoader.beforeInteractive || [])
    .filter((script) => script.src)
    .map((file: ScriptProps, index: number) => {
      const { strategy, ...scriptProps } = file;
      return (
        <script
          {...scriptProps}
          key={scriptProps.src || index}
          defer={scriptProps.defer ?? !disableOptimizedLoading}
          nonce={props.nonce}
          data-nscript="beforeInteractive"
          crossOrigin={props.crossOrigin || crossOrigin}
        />
      );
    });

  return (
    <>
      {webWorkerScripts}
      {beforeInteractiveScripts}
    </>
  );
}

export class NextScript extends React.Component<OriginProps> {
  static contextType = HtmlContext;

  context!: React.ContextType<typeof HtmlContext>;

  getDynamicChunks(files: DocumentFiles) {
    return getDynamicChunks(this.context, this.props, files);
  }

  getPreNextScripts() {
    return getPreNextScripts(this.context, this.props);
  }

  getScripts(files: DocumentFiles) {
    return getScripts(this.context, this.props, files);
  }

  getPolyfillScripts() {
    return getPolyfillScripts(this.context, this.props);
  }

  static getInlineScriptSource(context: Readonly<HtmlProps>): string {
    const { __NEXT_DATA__, largePageDataBytes } = context;
    try {
      const data = JSON.stringify(__NEXT_DATA__);
      const bytes =
        process.env.NEXT_RUNTIME === "edge"
          ? new TextEncoder().encode(data).buffer.byteLength
          : Buffer.from(data).byteLength;
      const prettyBytes = require("next/dist/lib/pretty-bytes").default;

      if (largePageDataBytes && bytes > largePageDataBytes) {
        console.warn(
          `Warning: data for page "${__NEXT_DATA__.page}"${
            __NEXT_DATA__.page === context.dangerousAsPath
              ? ""
              : ` (path "${context.dangerousAsPath}")`
          } is ${prettyBytes(
            bytes
          )} which exceeds the threshold of ${prettyBytes(
            largePageDataBytes
          )}, this amount of data can reduce performance.\nSee more info here: https://nextjs.org/docs/messages/large-page-data`
        );
      }

      return htmlEscapeJsonString(data);
    } catch (err) {
      if (isError(err) && err.message.indexOf("circular structure") !== -1) {
        throw new Error(
          `Circular structure in "getInitialProps" result of page "${__NEXT_DATA__.page}". https://nextjs.org/docs/messages/circular-structure`
        );
      }
      throw err;
    }
  }

  render() {
    const {
      assetPrefix,
      inAmpMode,
      buildManifest,
      unstable_runtimeJS,
      docComponentsRendered,
      devOnlyCacheBusterQueryString,
      disableOptimizedLoading,
      crossOrigin,
    } = this.context;
    const disableRuntimeJS = unstable_runtimeJS === false;

    docComponentsRendered.NextScript = true;

    if (process.env.NEXT_RUNTIME !== "edge" && inAmpMode) {
      if (process.env.NODE_ENV === "production") {
        return null;
      }
      const ampDevFiles = [
        ...buildManifest.devFiles,
        ...buildManifest.polyfillFiles,
        ...buildManifest.ampDevFiles,
      ];

      return (
        <>
          {disableRuntimeJS ? null : (
            <script
              id="__NEXT_DATA__"
              type="application/json"
              nonce={this.props.nonce}
              crossOrigin={this.props.crossOrigin || crossOrigin}
              dangerouslySetInnerHTML={{
                __html: NextScript.getInlineScriptSource(this.context),
              }}
              data-ampdevmode
            />
          )}
          {ampDevFiles.map((file) => (
            // eslint-disable-next-line @next/next/no-sync-scripts
            <script
              key={file}
              src={`${assetPrefix}/_next/${file}${devOnlyCacheBusterQueryString}`}
              nonce={this.props.nonce}
              crossOrigin={this.props.crossOrigin || crossOrigin}
              data-ampdevmode
            />
          ))}
        </>
      );
    }

    if (process.env.NODE_ENV !== "production") {
      if (this.props.crossOrigin)
        console.warn(
          "Warning: `NextScript` attribute `crossOrigin` is deprecated. https://nextjs.org/docs/messages/doc-crossorigin-deprecated"
        );
    }

    const files: DocumentFiles = getDocumentFiles(
      this.context.buildManifest,
      this.context.__NEXT_DATA__.page,
      process.env.NEXT_RUNTIME !== "edge" && inAmpMode
    );

    return (
      <>
        {!disableRuntimeJS && buildManifest.devFiles
          ? buildManifest.devFiles.map((file: string) => (
              // eslint-disable-next-line @next/next/no-sync-scripts
              <script
                key={file}
                src={`${assetPrefix}/_next/${encodeURI(
                  file
                )}${devOnlyCacheBusterQueryString}`}
                nonce={this.props.nonce}
                crossOrigin={this.props.crossOrigin || crossOrigin}
              />
            ))
          : null}
        {disableRuntimeJS ? null : (
          <script
            id="__NEXT_DATA__"
            type="application/json"
            nonce={this.props.nonce}
            crossOrigin={this.props.crossOrigin || crossOrigin}
            dangerouslySetInnerHTML={{
              __html: NextScript.getInlineScriptSource(this.context),
            }}
          />
        )}
        <span id="0" />
        {disableOptimizedLoading &&
          !disableRuntimeJS &&
          this.getPolyfillScripts()}
        <span id="1" />
        {disableOptimizedLoading &&
          !disableRuntimeJS &&
          this.getPreNextScripts()}
        <span id="2" />
        {disableOptimizedLoading &&
          !disableRuntimeJS &&
          this.getDynamicChunks(files)}
        <span id="3" />
        {disableOptimizedLoading && !disableRuntimeJS && this.getScripts(files)}
      </>
    );
  }
}
