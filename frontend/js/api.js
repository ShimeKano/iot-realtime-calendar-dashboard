async function fetchAirQuality(date) {
  const res = await fetch(`/api/GetAirQuality?city=Hanoi`);
  const data = await res.json();
  return data;
}
