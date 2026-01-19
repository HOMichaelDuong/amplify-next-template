"use client";

import Link from "next/link";
import styles from "./sidebar.module.css";
import { useAuthenticator } from "@aws-amplify/ui-react";

export default function Sidebar() {
  const { signOut } = useAuthenticator();

  return (
    <nav className={styles.sidebar} aria-label="Main navigation">
      <div className={styles.brand}>DEMO</div>
      <ul className={styles.navList}>
        <li>
          <Link href="/" className={styles.link}>
            Home
          </Link>
        </li>
        <li>
            <Link href="/data" className={styles.link}>
                Current Data
            </Link>
        </li>  
        <li>
          <Link href="/dashboard" className={styles.link}>
            Dashboard
          </Link>
        </li>   
        {/* <li>
          <Link href="/map" className={styles.link}>
            Map
          </Link>
        </li> */}
        <li>
          <Link href="/settings" className={styles.link}>
            Settings
          </Link>
        </li>
        
      </ul>

      <div className={styles.signOutWrapper}>
        <button className={styles.signOutButton} onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    </nav>
  );
}
