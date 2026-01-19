"use client"

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import styles from "@/page.module.css";

Amplify.configure(outputs);

export default function App() {

  return (
    <main className={styles.main}>
      <h1>Welcome to the Mapping Dashboard</h1>
      <p>This is a proof of concept dashboard to show how a mapping dashboard can be built using AWS Amplify, and NextJS.</p>
      <h1>How to use this dashboard</h1>
      <p>There are two key pages in the sidebar: Current Data, and Dashboard</p>
      <h3>Current Data</h3>
      <p>This page displays all the different types of data we have available to us, including any user defined data points (i.e. any markers added by the end users).</p>
      <h3>Dashboard</h3>
      <p>This page displays an interactive map to display any/all the data that is available, as well as add/amend/remove any user specified points.</p>
    </main>
  );
}
