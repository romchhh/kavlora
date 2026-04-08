import { Header } from "@/components/Header";
import { UpFooter } from "@/components/UpFooter";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import Image from "next/image";
import Link from "next/link";
import styles from "./Services.module.css";
import { useI18n } from "@/hooks/useI18n";
import { useEffect, useMemo, useRef, useState } from "react";

export default function ServicesPage() {
  const { dict } = useI18n();
  const collectionsSectionRef = useRef<HTMLElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);
  const [stackProgress, setStackProgress] = useState(0);
  const [isCollectionsInView, setIsCollectionsInView] = useState(false);

  const stackCssVars = useMemo(
    () => ({ ["--stack-progress" as any]: stackProgress }),
    [stackProgress]
  );

  useEffect(() => {
    const el = stackRef.current;
    if (!el) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;

      // Progress goes 0 -> 1 while the stack wrapper scrolls through viewport.
      const start = viewportH * 0.18;
      const end = viewportH * 0.82;
      const raw = (start - rect.top) / Math.max(1, rect.height - (end - start));
      const clamped = Math.min(1, Math.max(0, raw));
      setStackProgress(clamped);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const section = collectionsSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsCollectionsInView(true);
        observer.unobserve(entry.target);
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      <Seo
        title={dict.services.seoTitle}
        description={dict.services.seoDescription}
        path="/services"
      />
      <Header />

      <main>
        <section aria-label={dict.services.heroAriaLabel} className={styles.heroSection}>
          <video
            className={styles.heroVideo}
            src="/services/wood1.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className={styles.heroOverlay} />
          <div className={styles.heroInner}>
            <p className={styles.heroKicker}>{dict.services.heroKicker}</p>
            <h1 className={styles.heroTitle}>{dict.services.heroTitle}</h1>
          </div>
        </section>

        <section
          ref={collectionsSectionRef}
          className={styles.collectionsSection}
          aria-label={dict.services.collectionsAriaLabel}
          data-inview={isCollectionsInView ? "true" : "false"}
        >
          <div
            className={`${styles.collectionsInner} ${isCollectionsInView ? styles.collectionsInnerInView : ""}`}
          >
            <p className={styles.collectionsKicker}>{dict.services.collectionsKicker}</p>
            <h2 className={styles.collectionsTitle}>{dict.services.collectionsTitle}</h2>

            <div ref={stackRef} className={styles.cardsStack} style={stackCssVars}>
              <div className={styles.cardsStackItem}>
                <div className={`${styles.collectionCard} ${styles.collectionCardOne}`}>
                  <div className={styles.collectionMeta}>
                    <p className={styles.collectionIndex}>{dict.services.cards[0]?.index}</p>
                    <h3 className={styles.collectionHeading}>{dict.services.cards[0]?.title}</h3>
                    <p className={styles.collectionText}>{dict.services.cards[0]?.text}</p>
                    <Link href="/oak-lamella" className={styles.collectionReadMore}>
                      {dict.services.cards[0]?.ctaLabel}
                      <svg
                        aria-hidden="true"
                        className={styles.collectionReadMoreIcon}
                        viewBox="0 0 320 512"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
                      </svg>
                    </Link>
                  </div>
                  <figure className={styles.collectionImageWrap}>
                    <Image
                      src="/services/lamels.png"
                      alt={dict.services.cards[0]?.imageAlt}
                      fill
                      className={styles.collectionImage}
                      sizes="(max-width: 768px) 100vw, 55vw"
                    />
                  </figure>
                </div>
              </div>

              <div className={styles.cardsStackItem}>
                <div className={`${styles.collectionCard} ${styles.collectionCardAlt} ${styles.collectionCardTwo}`}>
                  <div className={styles.collectionMeta}>
                    <p className={styles.collectionIndex}>{dict.services.cards[1]?.index}</p>
                    <h3 className={styles.collectionHeading}>{dict.services.cards[1]?.title}</h3>
                    <p className={styles.collectionText}>{dict.services.cards[1]?.text}</p>
                    <Link href="/parquet" className={styles.collectionReadMore}>
                      {dict.services.cards[1]?.ctaLabel}
                      <svg
                        aria-hidden="true"
                        className={styles.collectionReadMoreIcon}
                        viewBox="0 0 320 512"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
                      </svg>
                    </Link>
                  </div>
                  <figure className={styles.collectionImageWrap}>
                    <Image
                      src="/services/parquet.jpeg"
                      alt={dict.services.cards[1]?.imageAlt}
                      fill
                      className={styles.collectionImage}
                      sizes="(max-width: 768px) 100vw, 55vw"
                    />
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </section>

        <UpFooter />
      </main>

      <Footer />
    </div>
  );
}

