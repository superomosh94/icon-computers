import './SpecsTable.css';

export default function SpecsTable({ laptop }) {
  const rows = [
    { label: 'Processor', value: `${laptop.cpuBrand} ${laptop.cpuFull}` },
    { label: 'CPU Generation', value: laptop.cpuGeneration },
    { label: 'Cores / Threads', value: `${laptop.cpuCores} Cores` },
    { label: 'Base Clock', value: laptop.cpuBaseClock },
    { label: 'Boost Clock', value: laptop.cpuBoostClock },
    { label: 'RAM', value: laptop.ram },
    { label: 'Storage', value: laptop.storage },
    { label: 'Screen Size', value: laptop.screenSize },
    { label: 'Resolution', value: laptop.screenResolution },
    { label: 'Graphics', value: laptop.gpu },
    { label: 'Operating System', value: laptop.os },
  ];

  return (
    <table className="specs-table">
      <tbody>
        {rows.map((row, idx) => (
          <tr key={row.label} className={idx % 2 === 0 ? 'specs-row-even' : ''}>
            <td className="specs-label">{row.label}</td>
            <td className="specs-value">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
