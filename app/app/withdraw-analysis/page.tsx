import WithdrawTable from "./withdraw-table";

export default function WithdrawAnalysis() {
  return (
    <div className="flex flex-col gap-4 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 bg-white p-2 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold tracking-tight">Análise de Saque</h2>
      </div>

      <WithdrawTable />
    </div>
  );
}
