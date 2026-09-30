import { useEffect, useState } from "react";
import { ThemeToggle } from "./components/ThemeToggle";
import { locateNode } from "./content/curriculum";
import { Atelier } from "./pages/Atelier";
import { Chapter } from "./pages/Chapter";
import { Home } from "./pages/Home";
import { Review } from "./pages/Review";

function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash.slice(2));
  useEffect(() => {
    const onChange = () => {
      setHash(window.location.hash.slice(2));
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

function Page({ route }: { route: string }) {
  if (route === "revisions") return <Review />;
  if (route === "atelier" || route.startsWith("atelier/")) return <Atelier levelId={route.split("/")[1]} />;
  const found = locateNode(route);
  if (!found?.node.lesson) return <Home />;
  return <Chapter node={found.node} number={found.number} moduleTitle={found.module.title} />;
}

export default function App() {
  const route = useHashRoute();
  return (
    <>
      <ThemeToggle />
      {/* The key remounts the page on every navigation: reviews and the "today" banner are recomputed. */}
      <Page key={route} route={route} />
    </>
  );
}
