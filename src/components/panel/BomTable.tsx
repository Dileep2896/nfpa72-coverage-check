import type { Bom, BomDiff } from "../../../shared/types";
export const money = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    v,
  );
export function BomTable({ bom, diff }: { bom: Bom; diff: BomDiff[] }) {
  return (
    <div className="bom">
      <div className="panel-section-heading">
        <h3>Bill of materials</h3>
        <span>{bom.totals.devices} devices</span>
      </div>
      <p className="muted">Quantities stay in sync with your layout.</p>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {bom.lines.map((line) => {
            const change = diff.find((d) => d.sku === line.sku);
            return (
              <tr key={line.sku} className={change ? "bom-changed" : ""}>
                <td>
                  <strong>{line.description}</strong>
                  <code>{line.sku}</code>
                  <small>{money(line.unitPrice)} each</small>
                </td>
                <td data-testid={`qty-${line.sku}`}>
                  {line.qty}
                  {change && (
                    <small className="quantity-diff">
                      {change.after - change.before > 0 ? "+" : ""}
                      {change.after - change.before}
                    </small>
                  )}
                </td>
                <td>{money(line.extended)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="bom-total">
        <span>Material total</span>
        <strong>{money(bom.totals.materials)}</strong>
      </div>
      <div className="bom-total muted">
        <span>Estimated install labor</span>
        <span>{bom.totals.laborHours.toFixed(2)} h</span>
      </div>
      <p className="bom-note">
        Includes one base per detector. Labor is shown separately; tax and
        markup excluded.
      </p>
    </div>
  );
}
