async function buy(name, price) {
  try {
    const response = await fetch(
      "https://harmora-backend.onrender.com/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: { name, price },
        }),
      }
    );

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Error creating checkout session.");
    }
  } catch (error) {
    console.error("Connection error:", error);
    alert("Error connecting to server.");
  }
}
