import { Header } from "@/components/Header";
import { UpFooter } from "@/components/UpFooter";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import Image from "next/image";
import styles from "./Parquet.module.css";
import { useI18n } from "@/hooks/useI18n";
import { useEffect, useRef, useState } from "react";
import { ContactModal } from "@/components/ContactModal";

export default function ParquetPage() {
  const { dict } = useI18n();
  const t = dict.productPages.parquet;
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const introSectionRef = useRef<HTMLElement | null>(null);
  const gallerySectionRef = useRef<HTMLElement | null>(null);
  const pointsSectionRef = useRef<HTMLElement | null>(null);
  const nextStepSectionRef = useRef<HTMLElement | null>(null);
  const [isIntroInView, setIsIntroInView] = useState(false);
  const [isGalleryInView, setIsGalleryInView] = useState(false);
  const [isPointsInView, setIsPointsInView] = useState(false);
  const [isNextStepInView, setIsNextStepInView] = useState(false);

  useEffect(() => {
    const sectionConfigs = [
      { ref: introSectionRef, setInView: setIsIntroInView, threshold: 0.2 },
      { ref: gallerySectionRef, setInView: setIsGalleryInView, threshold: 0.2 },
      { ref: pointsSectionRef, setInView: setIsPointsInView, threshold: 0.2 },
      { ref: nextStepSectionRef, setInView: setIsNextStepInView, threshold: 0.25 },
    ];

    const observers = sectionConfigs
      .map(({ ref, setInView, threshold }) => {
        const section = ref.current;
        if (!section) return null;

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            setInView(true);
            observer.unobserve(entry.target);
          },
          { threshold, rootMargin: "0px 0px -10% 0px" }
        );

        observer.observe(section);
        return observer;
      })
      .filter((observer): observer is IntersectionObserver => observer !== null);

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return (
    <div className={styles.page}>
      <Seo title={t.seoTitle} description={t.seoDescription} path="/parquet" />
      <Header forceDark={true} />

      <main className={styles.main}>
        <section
          ref={introSectionRef}
          className={`${styles.introSection} ${isIntroInView ? styles.introSectionInView : ""}`}
          aria-label={t.introAriaLabel}
        >
          <div className={styles.introInner}>
            <div className={styles.introGrid}>
              <div>
                <p className={styles.introKicker}>{t.introKicker}</p>
                <h1 className={styles.introTitle}>
                  <span className={styles.introTitleMuted}>{t.introTitleMuted}</span>
                  <span className={styles.introTitleStrong}>
                    {" "}
                    {t.introTitleStrong}
                  </span>
                </h1>
              </div>
              <div className={styles.introRight}>
                <p>{t.introRightText}</p>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={gallerySectionRef}
          className={`${styles.gallery} ${isGalleryInView ? styles.galleryInView : ""}`}
          aria-label={t.galleryAriaLabel}
        >
          {t.galleryImages.map((img) => (
            <figure key={img.src} className={styles.galleryFigure}>
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className={styles.galleryImg}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </figure>
          ))}
        </section>

        <section
          ref={pointsSectionRef}
          className={`${styles.pointsSection} ${isPointsInView ? styles.pointsSectionInView : ""}`}
          aria-label={t.pointsAriaLabel}
        >
          <div className={styles.pointsInner}>
            <div className={styles.pointsGrid}>
              {t.points.map((p) => (
                <article key={p.index} className={styles.point}>
                  <p className={styles.pointIndex}>{p.index}</p>
                  <div className={styles.pointLine} />
                  <h3 className={styles.pointTitle}>{p.title}</h3>
                  <p className={styles.pointText}>{p.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          ref={nextStepSectionRef}
          className={`${styles.nextStepSection} ${isNextStepInView ? styles.nextStepSectionInView : ""}`}
          aria-label={t.nextStepAriaLabel}
        >
          <div className={styles.nextStepInner}>
            <p className={styles.nextStepKicker}>{t.nextStepKicker}</p>
            <h2 className={styles.nextStepTitle}>{t.nextStepTitle}</h2>
            <p className={styles.nextStepText}>{t.nextStepText}</p>
            <button
              type="button"
              className={styles.nextStepCta}
              onClick={() => setIsContactModalOpen(true)}
            >
              {t.nextStepCta}
            </button>
          </div>
        </section>

        <UpFooter />
      </main>

      <Footer />
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
}

