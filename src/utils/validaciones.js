export function esRunValido(valor) {
  const run = valor.trim().toUpperCase();
  if (!/^[0-9]{7,8}[0-9K]$/.test(run)) return false;

  const cuerpo = run.slice(0, -1);
  const dv = run.slice(-1);
  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const resto = 11 - (suma % 11);
  let esperado = String(resto);
  if (resto === 11) esperado = "0";
  if (resto === 10) esperado = "K";

  return dv === esperado;
}

export function esCorreoValido(valor) {
  return /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(valor.trim());
}