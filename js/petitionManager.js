async function getJSON(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.warn(error);
    alert(error);
  }
}

async function postJSON(url, data = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.warn(error);
    alert(error);
  }
}

export { getJSON, postJSON };
