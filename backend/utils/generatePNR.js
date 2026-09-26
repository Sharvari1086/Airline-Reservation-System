const generatePNR = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pnr = '';
  for (let i = 0; i < 6; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
};

const generateTransactionId = () => {
  return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
};

module.exports = { generatePNR, generateTransactionId };