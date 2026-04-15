app.js
async function buy() {
  const res = await fetch("https://YOUR-BACKEND-URL.onrender.com/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      product: {
        name: "Beat Pack 1",
        price: 10
      }
    })
  });

  const data = await res.json();
  window.location.href = data.url;
}
