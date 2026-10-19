import { REGIONES_COMUNAS } from "../data/regiones";

function RegionComuna({ region, comuna, onChange, errores = {} }) {
  const comunas = REGIONES_COMUNAS[region] || [];

  return (
    <>
      <div className="campo-formulario">
        <label htmlFor="region">Región</label>
        <select
          id="region"
          name="region"
          value={region}
          onChange={onChange}
          className={errores.region ? "campo-invalido" : ""}
        >
          <option value="">Selecciona una región</option>
          {Object.keys(REGIONES_COMUNAS).map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        {errores.region && <small className="texto-error visible">{errores.region}</small>}
      </div>

      <div className="campo-formulario">
        <label htmlFor="comuna">Comuna</label>
        <select
          id="comuna"
          name="comuna"
          value={comuna}
          onChange={onChange}
          disabled={!region}
          className={errores.comuna ? "campo-invalido" : ""}
        >
          <option value="">Selecciona una comuna</option>
          {comunas.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errores.comuna && <small className="texto-error visible">{errores.comuna}</small>}
      </div>
    </>
  );
}

export default RegionComuna;