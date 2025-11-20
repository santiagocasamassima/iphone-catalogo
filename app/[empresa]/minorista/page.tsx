export default async function MinoristaPage({ params }: { params: Promise<{ empresa: string }> }) {
  const { empresa } = await params;

  return (
    <main style={{ padding: "24px" }}>
      <h1 style={{ fontSize: "32px" }}>Catálogo Minorista</h1>

      <p style={{ marginTop: "12px", fontSize: "18px" }}>
        Empresa: {empresa}
      </p>
    </main>
  );
}

