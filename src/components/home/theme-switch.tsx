"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import styles from "./theme-switch.module.css";

const ThemeSwitch = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <label className={styles.switch} aria-label="Toggle theme">
      <input
        type="checkbox"
        checked={isDark}
        onChange={() => setTheme(isDark ? "light" : "dark")}
      />

      <div className={`${styles.slider} ${styles.round}`}>
        {/* SUN / MOON */}
        <div className={styles.sunMoon}>
          {/* moon dots */}
          <span className={`${styles.moonDot} ${styles.moonDot1}`} />
          <span className={`${styles.moonDot} ${styles.moonDot2}`} />
          <span className={`${styles.moonDot} ${styles.moonDot3}`} />

          {/* light rays */}
          <span className={`${styles.lightRay} ${styles.lightRay1}`} />
          <span className={`${styles.lightRay} ${styles.lightRay2}`} />
          <span className={`${styles.lightRay} ${styles.lightRay3}`} />

          {/* clouds */}
          <span className={`${styles.cloudDark} ${styles.cloud1}`} />
          <span className={`${styles.cloudDark} ${styles.cloud2}`} />
          <span className={`${styles.cloudDark} ${styles.cloud3}`} />
          <span className={`${styles.cloudLight} ${styles.cloud4}`} />
          <span className={`${styles.cloudLight} ${styles.cloud5}`} />
          <span className={`${styles.cloudLight} ${styles.cloud6}`} />
        </div>

        {/* STARS */}
        <div className={styles.stars}>
          <span className={`${styles.star} ${styles.star1}`} />
          <span className={`${styles.star} ${styles.star2}`} />
          <span className={`${styles.star} ${styles.star3}`} />
          <span className={`${styles.star} ${styles.star4}`} />
        </div>
      </div>
    </label>
  );
};

export default ThemeSwitch;
