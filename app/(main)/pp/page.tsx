"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [fact, setFact] = useState("no thing");
  const [loading, setLoading] = useState(true);
  function fetchFact() {
    setLoading(true);
    fetch("https://catfact.ninja/fact")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setLoading(false);
        setFact(data.fact);
      });
  }

  useEffect(() => {
    fetchFact();
  }, []);

  function handleClick() {
    fetchFact();
  }
  return (
    <div className="p-4">
      {loading ? <h1>loading ...</h1> : <h1 onClick={handleClick}>{fact}</h1>}
    </div>
  );
}
