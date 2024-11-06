// Simulated email sending function
export const sendApprovalEmail = async (customerInfo: { fullName: string; email: string }, orderDetails: any) => {
  // In a real application, this would integrate with an email service
  // For now, we'll simulate the email sending with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('Email sent to:', customerInfo.email, {
    subject: `Order Approval Request: ${orderDetails.title}`,
    to: customerInfo.email,
    customerName: customerInfo.fullName,
    orderDetails
  });

  return true;
};