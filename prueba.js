const { basename } = require('path');
const { Tropipay } = require('./index.js');

// ==================== CONFIGURACIÓN ====================
const CREDENTIALS = {
  clientId: '74b87337454200d4d33f80c4663dc5e5',
  clientSecret: '5359ddc7a14d5ee19b770b522c282b94',
  serverMode: 'Development', // 'Development' | 'Production',
  baseUrl: "http://localhost:3001"

};

const ORDER_CODE = 'TX1782394602873727'; // Código de la orden a reembolsar
const AMOUNT = 500;             // Monto en céntimos (5000 = 50.00 USD/EUR)
// =======================================================

async function main() {
  const tpp = new Tropipay({
    clientId: CREDENTIALS.clientId,
    clientSecret: CREDENTIALS.clientSecret,
    serverMode: CREDENTIALS.serverMode,
    baseUrl: CREDENTIALS.baseUrl
  });

  console.log(tpp.scopes);

  console.log(`💰 Reembolsando orden ${ORDER_CODE} por ${AMOUNT} céntimos...`);

  // await tpp.requestSecurityCode()

  const result = await tpp.refundMovement(ORDER_CODE, AMOUNT, "123456");
  console.log('✅ Código de seguridad enviado. Por favor, revisa tu correo o SMS para obtener el código.');
  console.log('✅ Refund exitoso:', JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});

