import Head from "next/head";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Kavlora</title>
        <meta name="description" content="Kavlora" />
      </Head>

      <div className={styles.page}>
        <Header />
        <main>
          <section aria-label="Головний банер" className={styles.hero}>
            <Image
              src="/main_banner.jpg"
              alt="Банер"
              fill
              priority
              className={styles.coverImage}
              sizes="100vw"
            />

            <div className={styles.heroOverlay} />

            <div className={styles.heroInner}>
              <div className={styles.heroGrid}>
                <div>
                  <p className={styles.heroKicker}>
                    ДУБОВІ ЛАМЕЛІ ТА ЗАГОТОВКИ ДЛЯ ПАРКЕТУ
                  </p>
                  <h1 className={styles.heroTitle}>Дуб, який видно. Якість, яку відчувають.</h1>

                  <div className={styles.heroActions}>
                    <a href="#services" className={styles.btnPrimary}>
                      Послуги
                    </a>
                    <a href="/contact" className={styles.btnGhost}>
                      Записатись
                    </a>
                  </div>
                </div>

                <div className={styles.heroDescWrap}>
                  <p className={styles.heroDesc}>
                    Ламелі від 2 мм, класи A/B/C/D. Заготовки для паркетної дошки за розмірами
                    вашого замовлення.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section aria-label="Про продукт" className={styles.productSection}>
            <div className={styles.container}>
              <div className={styles.productTop}>
                <p className={styles.productKicker}>СТВОРЕНО ДЛЯ ВАС</p>

                <p className={styles.productLead}>
                Компанія KAVLORA спеціалізується на виробництві дубових ламелей та заготовки для паркетної дошки.
                Від відбору сировини до фінальної геометрії – кожна деталь під контролем якості.
                </p>
              </div>

              <div className={styles.staggerGrid}>
                <figure className={styles.staggerPhoto}>
                  <Image
                    src="/main/photo1.jpeg"
                    alt="Інтер'єр з дверима"
                    fill
                    className={styles.coverImage}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </figure>

                <figure className={`${styles.staggerPhoto} ${styles.photoMid}`}>
                  <Image
                    src="/main/photo2.png"
                    alt="Вхідна група"
                    fill
                    className={styles.coverImage}
                    sizes="(max-width: 768px) 100vw, 34vw"
                  />
                </figure>

                <figure className={`${styles.staggerPhoto} ${styles.photoLow}`}>
                  <Image
                    src="/main/photo3.png"
                    alt="Дизайнерський інтер'єр"
                    fill
                    className={styles.coverImage}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </figure>
              </div>
            </div>
          </section>

          <section aria-label="Статистика" className={styles.statsSection}>
            <div className={styles.statsContainer}>
              <div className={styles.statsRow}>
                <div className={styles.statItem}>
                  <div className={styles.statTop}>
                    <div className={styles.statNumber}>10 000 м²</div>
                    <div className={styles.statLabel}>
                      Загальної
                      <br />
                      площі
                      <br />
                      приміщень
                    </div>
                  </div>
                </div>

                <div className={styles.statItem}>
                  <div className={styles.statTop}>
                    <div className={styles.statNumber}>50+</div>
                    <div className={styles.statLabel}>
                      Працівників
                      <br />
                      компанії
                    </div>
                  </div>
                </div>

                <div className={styles.statItem}>
                  <div className={styles.statTop}>
                    <div className={styles.statNumber}>1000 м³</div>
                    <div className={styles.statLabel}>Переробки <br />сировини <br />в місяць</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section aria-label="відгук" className={styles.statsQuoteSection}>
            <div className={styles.statsQuoteContainer}>
              <div className={styles.quote}>
                <div className={styles.personCard}>
                  <div className={styles.personAvatar}>
                    <Image
                      src="/avatar.png"
                      alt="Андрій Гайіб"
                      width={56}
                      height={56}
                      priority
                    />
                  </div>
                  <p className={styles.personName}>Микола Сорочук</p>
                  <p className={styles.personRole}>Засновник</p>
                </div>

                <p className={styles.quoteText}>
                  У Kavlora ми виготовляємо дубові ламелі товщиною від 2 мм у класах якості A, B, C, D та
                  заготовки для паркетної дошки за індивідуальними розмірами замовника. Для нас важливі
                  прозора комунікація, точна геометрія та стабільна якість у кожній партії. Наша мета
                  проста: дати вам надійний матеріал, з яким зручно працювати і який гарантує довговічний
                  результат від виробництва.
                </p>
              </div>
            </div>
          </section>

          <section id="services" className={styles.services}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Послуги</h2>
              <p className={styles.sectionLead}>
                Оберіть тип послуги — нижче є 4 варіанти для прикладу (можемо замінити на реальні
                назви та описи).
              </p>

              <div className={styles.cards2}>
                {[
                  { id: "services-type-1", title: "ТИП 1", text: "Короткий опис послуги." },
                  { id: "services-type-2", title: "ТИП 2", text: "Короткий опис послуги." },
                  { id: "services-type-3", title: "ТИП 3", text: "Короткий опис послуги." },
                  { id: "services-type-4", title: "ТИП 4", text: "Короткий опис послуги." },
                ].map((card) => (
                  <div key={card.id} id={card.id} className={styles.card}>
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <p className={styles.cardText}>{card.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="advantages" className={styles.advantages}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Переваги</h2>
              <div className={styles.cards3}>
                {[
                  "Преміальні матеріали",
                  "Індивідуальний підхід",
                  "Супровід від старту до монтажу",
                ].map((t) => (
                  <div key={t} className={styles.card}>
                    <p className={styles.advText}>{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="about" className={styles.about}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Про нас</h2>
              <p className={styles.aboutText}>
                Тут буде коротка історія бренду та підхід до роботи. Секцію зробив як базовий
                каркас — наповнимо контентом, коли буде текст.
              </p>
            </div>
          </section>

        </main>
        <Footer />
      </div>
    </>
  );
}
