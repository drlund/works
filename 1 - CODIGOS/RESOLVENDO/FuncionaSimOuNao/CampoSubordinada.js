<Card title="Parametrização das Alçadas do Portal de Movimentações">
  {renderActionButtons()}

  <p>Subordinada: {subordinada}</p> {/* Adicione esta linha */}

  <SearchTable
    className="styledTableHead"
    columns={columns}
    dataSource={parametros}
    rowKey="id"
    size="small"
    pagination={{ showSizeChanger: true }}
    bordered
  />
  
</Card>