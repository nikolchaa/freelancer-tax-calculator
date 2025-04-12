export async function handler() {
  try {
    const response = await fetch(
      "https://kurs.resenje.org/api/v1/currencies/eur/rates/today"
    );
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Greška prilikom dohvata kursa" }),
    };
  }
}
