async function getJSON(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.warn(error);
    alert(error);
  }
}

export { getJSON };
