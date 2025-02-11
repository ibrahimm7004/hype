const formatCurrency = (amount) => {
  if (amount == null || amount === "") return "N/A";

  // Convert to number
  const num = parseFloat(amount);

  // Check for NaN
  if (isNaN(num)) return "N/A";

  // Convert to Pakistani currency format
  const lac = Math.floor(num / 100000);
  const rupees = num % 100000;

  // Format rupees with commas
  const formattedRupees = rupees.toLocaleString("en-PK");

  return `${lac > 0 ? `${lac} lac` : ""} 
  ${rupees > 0 && rupees < 100000 ? `${formattedRupees} rupees` : ""}
  `.trim();
};

export default formatCurrency;
