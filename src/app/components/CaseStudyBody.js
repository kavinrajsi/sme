import Image from "next/image";
import { RichText } from "@payloadcms/richtext-lexical/react";
import styles from "./CaseStudyBody.module.css";

function getEmbedSrc(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "youtube.com" || host.endsWith(".youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith("/embed/")) return u.toString();
    }
    if (host === "vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

function RichTextBlock({ block }) {
  return (
    <RichText
      className={styles.richText}
      data={block.content}
      disableContainer
    />
  );
}

function ImageBlock({ block }) {
  const media = block.media;
  if (!media?.url) return null;
  return (
    <figure className={styles.image}>
      <Image
        src={media.url}
        alt={media.alt || block.caption || ""}
        width={media.width || 1280}
        height={media.height || 720}
        sizes="(max-width: 720px) 100vw, 720px"
        style={{ width: "100%", height: "auto" }}
      />
      {block.caption ? (
        <figcaption className={styles.caption}>{block.caption}</figcaption>
      ) : null}
    </figure>
  );
}

function QuoteBlock({ block }) {
  return (
    <blockquote className={styles.quote}>
      <p className={styles.quoteText}>{block.quote}</p>
      {block.attribution ? (
        <cite className={styles.attribution}>— {block.attribution}</cite>
      ) : null}
    </blockquote>
  );
}

function CalloutBlock({ block }) {
  const styleClass =
    block.style === "success"
      ? styles.calloutSuccess
      : block.style === "warning"
        ? styles.calloutWarning
        : styles.calloutInfo;
  return (
    <aside className={`${styles.callout} ${styleClass}`}>
      <RichText data={block.body} disableContainer />
    </aside>
  );
}

function StatsBlock({ block }) {
  if (!Array.isArray(block.items) || block.items.length === 0) return null;
  return (
    <div className={styles.stats}>
      {block.items.map((item, i) => (
        <div key={i} className={styles.stat}>
          <span className={styles.statValue}>{item.value}</span>
          <span className={styles.statLabel}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function VideoBlock({ block }) {
  const src = getEmbedSrc(block.url);
  if (!src) return null;
  return (
    <figure className={styles.video}>
      <div className={styles.videoFrame}>
        <iframe
          src={src}
          title={block.caption || "Embedded video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      {block.caption ? (
        <figcaption className={styles.caption}>{block.caption}</figcaption>
      ) : null}
    </figure>
  );
}

function CodeBlock({ block }) {
  return (
    <pre
      className={styles.code}
      data-language={block.language || "plaintext"}
    >
      <code>{block.code}</code>
    </pre>
  );
}

const RENDERERS = {
  richText: RichTextBlock,
  image: ImageBlock,
  quote: QuoteBlock,
  callout: CalloutBlock,
  stats: StatsBlock,
  video: VideoBlock,
  code: CodeBlock,
};

export default function CaseStudyBody({ blocks }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;
  return (
    <div className={styles.body}>
      {blocks.map((block, i) => {
        const Renderer = RENDERERS[block?.blockType];
        if (!Renderer) return null;
        return <Renderer key={block.id || i} block={block} />;
      })}
    </div>
  );
}
