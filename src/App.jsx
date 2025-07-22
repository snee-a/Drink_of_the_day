import React, { useState } from "react";
import { motion } from "framer-motion";

function App() {
  const [query, setQuery] = useState("");
  const [drink, setDrink] = useState(null);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");

  const fetchDrink = async () => {
    try {
      const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${query}`);
      const data = await res.json();

      if (data.drinks) {
        const randomDrink = data.drinks[Math.floor(Math.random() * data.drinks.length)];

        // Fetch full recipe details using ID
        const res2 = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${randomDrink.idDrink}`);
        const data2 = await res2.json();
        setDetails(data2.drinks[0]);
        setDrink(randomDrink);
        setError("");
      } else {
        setDrink(null);
        setDetails(null);
        setError("No drink found.");
      }
    } catch (err) {
      setError("Error fetching drink.");
      setDrink(null);
      setDetails(null);
    }
  };

  const extractIngredients = (drinkObj) => {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = drinkObj[`strIngredient${i}`];
      const measure = drinkObj[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push({
          name: ingredient,
          measure: measure || "",
          image: `https://www.thecocktaildb.com/images/ingredients/${ingredient}-Small.png`,
        });
      }
    }
    return ingredients;
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ fontSize: "2.5rem", marginBottom: "1rem" }}
      >
        🍹 Drink of the day
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <input
          type="text"
          placeholder="Enter an ingredient (e.g. Vodka)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "0.6rem 1rem",
            borderRadius: "8px",
            border: "none",
            outline: "none",
            width: "250px",
          }}
        />
        <button
          onClick={fetchDrink}
          style={{
            marginLeft: "1rem",
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#FF6B6B",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Mix My Drink
        </button>
      </motion.div>

      {error && <p style={{ color: "tomato", marginTop: "1rem" }}>{error}</p>}

      {details && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            marginTop: "2rem",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: "2rem",
            borderRadius: "12px",
            maxWidth: "600px",
            margin: "2rem auto",
          }}
        >
          <h2>{details.strDrink}</h2>
          <img
            src={details.strDrinkThumb}
            alt={details.strDrink}
            style={{ width: "200px", borderRadius: "12px", marginBottom: "1rem" }}
          />
          <p style={{ fontStyle: "italic", marginTop: "1rem" }}>
            <strong>Instructions:</strong> {details.strInstructions}
          </p>

          <h3 style={{ marginTop: "1.5rem" }}>🧪 Ingredients</h3>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
            {extractIngredients(details).map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                style={{
                  backgroundColor: "#ffffff22",
                  borderRadius: "10px",
                  padding: "1rem",
                  textAlign: "center",
                  width: "100px",
                }}
              >
                <img src={item.image} alt={item.name} style={{ width: "50px", marginBottom: "0.5rem" }} />
                <p style={{ fontSize: "0.9rem", margin: 0 }}>{item.name}</p>
                <p style={{ fontSize: "0.8rem", margin: 0 }}>{item.measure}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default App;
