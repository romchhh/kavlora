import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ContactModal } from "@/components/ContactModal";
import styles from "./Header.module.css";

type ServiceItem = { label: string; href: string };
type HeaderProps = {
  services?: ServiceItem[];
  forceDark?: boolean;
};

const LANGUAGES = [
  { code: "uk", label: "Українська", menuLabel: "UA" },
  { code: "en", label: "English", menuLabel: "EN" },
  { code: "zh-CN", label: "中文", menuLabel: "zh-CN" },
] as const;
type LocaleCode = (typeof LANGUAGES)[number]["code"];

type HeaderCopy = {
  homeAriaLabel: string;
  services: string;
  advantages: string;
  about: string;
  contact: string;
  contactCta: string;
  openMenu: string;
  closeMenu: string;
  mobileMenuAriaLabel: string;
  expandServiceTypes: string;
  collapseServiceTypes: string;
  languageSwitcherLabel: string;
  switchLanguagePrefix: string;
  serviceTypes: ServiceItem[];
};

const HEADER_COPY: Record<LocaleCode, HeaderCopy> = {
  uk: {
    homeAriaLabel: "Головна",
    services: "Послуги",
    advantages: "Переваги",
    about: "Про нас",
    contact: "Контакти",
    contactCta: "Зв'язатися",
    openMenu: "Відкрити меню",
    closeMenu: "Закрити меню",
    mobileMenuAriaLabel: "Мобільне меню",
    expandServiceTypes: "Розгорнути типи послуг",
    collapseServiceTypes: "Згорнути типи послуг",
    languageSwitcherLabel: "Перемикач мови",
    switchLanguagePrefix: "Перемкнути мову на",
    serviceTypes: [
      { label: "Дубові ламелі", href: "/oak-lamella" },
      { label: "Заготовки для паркетної дошки", href: "/parquet" },
    ],
  },
  en: {
    homeAriaLabel: "Home",
    services: "Services",
    advantages: "Advantages",
    about: "About us",
    contact: "Contacts",
    contactCta: "Contact us",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    mobileMenuAriaLabel: "Mobile menu",
    expandServiceTypes: "Expand service types",
    collapseServiceTypes: "Collapse service types",
    languageSwitcherLabel: "Language switcher",
    switchLanguagePrefix: "Switch language to",
    serviceTypes: [
      { label: "Oak lamellas", href: "/oak-lamella" },
      { label: "Parquet board blanks", href: "/parquet" },
    ],
  },
  "zh-CN": {
    homeAriaLabel: "主页",
    services: "服务",
    advantages: "优势",
    about: "关于我们",
    contact: "联系我们",
    contactCta: "联系我们",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
    mobileMenuAriaLabel: "移动端菜单",
    expandServiceTypes: "展开服务类型",
    collapseServiceTypes: "收起服务类型",
    languageSwitcherLabel: "语言切换",
    switchLanguagePrefix: "切换语言到",
    serviceTypes: [
      { label: "橡木贴片", href: "/oak-lamella" },
      { label: "地板坯料", href: "/parquet" },
    ],
  },
};

function resolveLocale(locale?: string): LocaleCode {
  if (locale === "uk" || locale === "en" || locale === "zh-CN") return locale;
  if (locale?.startsWith("zh")) return "zh-CN";
  return "uk";
}

export function Header({ services, forceDark = false }: HeaderProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [desktopLangOpen, setDesktopLangOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const desktopLangRef = useRef<HTMLDivElement | null>(null);
  const mobileLangRef = useRef<HTMLDivElement | null>(null);
  const servicesButtonId = useId();
  const servicesMenuId = useMemo(() => `${servicesButtonId}-menu`, [servicesButtonId]);
  const desktopLangButtonId = useId();
  const desktopLangMenuId = useMemo(() => `${desktopLangButtonId}-menu`, [desktopLangButtonId]);
  const mobileLangButtonId = useId();
  const mobileLangMenuId = useMemo(() => `${mobileLangButtonId}-menu`, [mobileLangButtonId]);
  const currentLocale = resolveLocale(router.locale);
  const copy = HEADER_COPY[currentLocale];
  const menuServices = services ?? copy.serviceTypes;

  function clearCloseTimer() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function openServicesMenu() {
    clearCloseTimer();
    setServicesOpen(true);
  }

  function closeServicesMenuWithDelay() {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setServicesOpen(false), 180);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        clearCloseTimer();
        setServicesOpen(false);
        setDesktopLangOpen(false);
        setMobileLangOpen(false);
        setMobileOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 24);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!desktopLangRef.current?.contains(event.target as Node)) {
        setDesktopLangOpen(false);
      }
      if (!mobileLangRef.current?.contains(event.target as Node)) {
        setMobileLangOpen(false);
      }
    }

    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled || forceDark ? styles.headerScrolled : ""}`}>
      <div className={styles.inner}>
        <Link
          href="/"
          aria-label={copy.homeAriaLabel}
          className={styles.logoLink}
          onClick={() => {
            setMobileOpen(false);
            setServicesOpen(false);
          }}
        >
          <Image src="/logo2.png" alt="Kavlora" width={160} height={38} priority />
        </Link>

        <nav className={styles.navDesktop}>
          <div
            className={`${styles.servicesWrap} ${servicesOpen ? styles.servicesWrapOpen : ""}`}
            onMouseEnter={openServicesMenu}
            onMouseLeave={closeServicesMenuWithDelay}
            onFocus={openServicesMenu}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                closeServicesMenuWithDelay();
              }
            }}
          >
            <Link
              id={servicesButtonId}
              className={`${styles.navLink} ${styles.servicesButton}`}
              href="/services"
              aria-haspopup="menu"
              aria-expanded={servicesOpen}
              aria-controls={servicesMenuId}
              onClick={() => clearCloseTimer()}
            >
              {copy.services}
              <span className={styles.chevron} aria-hidden="true" />
            </Link>

            <div id={servicesMenuId} role="menu" className={styles.servicesMenu}>
              {menuServices.slice(0, 4).map((item) => (
                <Link
                  key={item.href}
                  role="menuitem"
                  href={item.href}
                  locale={router.locale}
                  className={styles.servicesItem}
                  onClick={() => {
                    clearCloseTimer();
                    setServicesOpen(false);
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <Link className={styles.navLink} href="/advantages">
            {copy.advantages}
          </Link>
          <Link className={styles.navLink} href="/about-us">
            {copy.about}
          </Link>
          <Link className={styles.navLink} href="/contact">
            {copy.contact}
          </Link>
        </nav>
        <div className={styles.headerCtaActions}>
          <div className={styles.langSwitcher} aria-label={copy.languageSwitcherLabel}>
            <div
              ref={desktopLangRef}
              className={`${styles.langDropdown} ${desktopLangOpen ? styles.langDropdownOpen : ""}`}
            >
              <button
                id={desktopLangButtonId}
                type="button"
                className={styles.langDropdownTrigger}
                aria-label={copy.languageSwitcherLabel}
                aria-haspopup="menu"
                aria-expanded={desktopLangOpen}
                aria-controls={desktopLangMenuId}
                onClick={() => setDesktopLangOpen((prev) => !prev)}
              >
                <Image
                  src="/language.svg"
                  alt=""
                  aria-hidden="true"
                  width={18}
                  height={18}
                  className={styles.languageIcon}
                />
                <span className={styles.langDropdownChevron} aria-hidden="true" />
              </button>
              <div id={desktopLangMenuId} role="menu" className={styles.langDropdownMenu}>
                {LANGUAGES.map((language) => (
                  <button
                    key={language.code}
                    type="button"
                    role="menuitemradio"
                    aria-checked={currentLocale === language.code}
                    className={`${styles.langDropdownItem} ${
                      currentLocale === language.code ? styles.langDropdownItemActive : ""
                    }`}
                    onClick={() => {
                      setDesktopLangOpen(false);
                      if (currentLocale === language.code) return;
                      void router.push(router.asPath, router.asPath, {
                        locale: language.code,
                        scroll: false,
                      });
                    }}
                  >
                    {language.menuLabel}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            type="button"
            className={styles.headerCta}
            onClick={() => setIsContactModalOpen(true)}
          >
            {copy.contactCta}
          </button>
        </div>
        <button
          type="button"
          className={styles.mobileToggle}
          aria-label={mobileOpen ? copy.closeMenu : copy.openMenu}
          aria-expanded={mobileOpen}
          onClick={() => {
            setMobileOpen((v) => {
              const next = !v;
              if (!next) setMobileServicesOpen(false);
              return next;
            });
          }}
        >
          <span className={styles.burger} aria-hidden="true">
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
          </span>
        </button>
      </div>

      {mobileOpen ? (
        <div className={styles.mobileOverlay}>
          <div className={styles.mobileDrawer}>
            <Link
              href="/"
              aria-label={copy.homeAriaLabel}
              className={styles.mobileLogoLink}
              onClick={() => {
                setMobileOpen(false);
                setMobileServicesOpen(false);
                setMobileLangOpen(false);
              }}
            >
              <Image src="/logo2.png" alt="Kavlora" width={160} height={38} priority />
            </Link>
            <button
              type="button"
              className={styles.mobileClose}
              aria-label={copy.closeMenu}
              onClick={() => {
                setMobileOpen(false);
                setMobileServicesOpen(false);
                setMobileLangOpen(false);
              }}
            >
              <span />
              <span />
            </button>

            <nav className={styles.mobileNav} aria-label={copy.mobileMenuAriaLabel}>
              <div className={styles.mobileServicesRow}>
                <Link
                  className={styles.mobileLink}
                  href="/services"
                  onClick={() => {
                    setMobileOpen(false);
                    setMobileServicesOpen(false);
                    setMobileLangOpen(false);
                  }}
                >
                  {copy.services}
                </Link>
                <button
                  type="button"
                  className={styles.mobileServicesToggle}
                  aria-label={mobileServicesOpen ? copy.collapseServiceTypes : copy.expandServiceTypes}
                  aria-expanded={mobileServicesOpen}
                  onClick={() => setMobileServicesOpen((v) => !v)}
                >
                  <span
                    className={`${styles.mobileServicesChevron} ${
                      mobileServicesOpen ? styles.mobileServicesChevronOpen : ""
                    }`}
                  />
                </button>
              </div>

              {mobileServicesOpen ? (
                <div className={styles.mobileSublist}>
                  {menuServices.slice(0, 4).map((item) => (
                    <Link
                      key={item.href}
                      className={styles.mobileSublink}
                      href={item.href}
                      locale={router.locale}
                      onClick={() => {
                        setMobileOpen(false);
                        setMobileServicesOpen(false);
                        setMobileLangOpen(false);
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}

              <Link
                className={styles.mobileLink}
                href="/advantages"
                onClick={() => {
                  setMobileOpen(false);
                  setMobileServicesOpen(false);
                  setMobileLangOpen(false);
                }}
              >
                {copy.advantages}
              </Link>
              <Link
                className={styles.mobileLink}
                href="/about-us"
                onClick={() => {
                  setMobileOpen(false);
                  setMobileServicesOpen(false);
                  setMobileLangOpen(false);
                }}
              >
                {copy.about}
              </Link>
              <Link
                className={styles.mobileLink}
                href="/contact"
                onClick={() => {
                  setMobileOpen(false);
                  setMobileServicesOpen(false);
                  setMobileLangOpen(false);
                }}
              >
                {copy.contact}
              </Link>
              <button
                type="button"
                className={styles.mobileModalCta}
                onClick={() => {
                  setMobileOpen(false);
                  setMobileServicesOpen(false);
                  setMobileLangOpen(false);
                  setIsContactModalOpen(true);
                }}
              >
                {copy.contactCta}
              </button>
              <div className={styles.mobileLangSwitcher} aria-label={copy.languageSwitcherLabel}>
                <div
                  ref={mobileLangRef}
                  className={`${styles.mobileLangDropdown} ${mobileLangOpen ? styles.mobileLangDropdownOpen : ""}`}
                >
                  <button
                    id={mobileLangButtonId}
                    type="button"
                    className={styles.mobileLangTrigger}
                    aria-label={copy.languageSwitcherLabel}
                    aria-haspopup="menu"
                    aria-expanded={mobileLangOpen}
                    aria-controls={mobileLangMenuId}
                    onClick={() => setMobileLangOpen((prev) => !prev)}
                  >
                    <Image
                      src="/language.svg"
                      alt=""
                      aria-hidden="true"
                      width={18}
                      height={18}
                      className={styles.languageIcon}
                    />
                    <span className={styles.mobileLangChevron} aria-hidden="true" />
                  </button>
                  <div id={mobileLangMenuId} role="menu" className={styles.mobileLangMenu}>
                    {LANGUAGES.map((language) => (
                      <button
                        key={`mobile-${language.code}`}
                        type="button"
                        role="menuitemradio"
                        aria-checked={currentLocale === language.code}
                        className={`${styles.mobileLangItem} ${
                          currentLocale === language.code ? styles.mobileLangItemActive : ""
                        }`}
                        onClick={() => {
                          setMobileLangOpen(false);
                          setMobileOpen(false);
                          setMobileServicesOpen(false);
                          if (currentLocale === language.code) return;
                          void router.push(router.asPath, router.asPath, {
                            locale: language.code,
                            scroll: false,
                          });
                        }}
                      >
                        {language.menuLabel}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      ) : null}
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </header>
  );
}

