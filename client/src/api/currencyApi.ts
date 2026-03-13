export async function saveCurrency(currency: string) {

  const response = await fetch("/api/user/currency", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ currency })
  });

  return response.json();
}