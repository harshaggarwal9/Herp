import crypto from 'crypto';
import Fee from '../models/fees.model.js';

export const handleRazorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const webhookBody = req.body;             // Buffer
  const signature = req.headers['x-razorpay-signature'];

  // 1. Verify signature
  const expected = crypto
    .createHmac('sha256', secret)
    .update(webhookBody)
    .digest('hex');

  if (expected !== signature) {
    console.warn('🚨 Invalid webhook signature');
    return res.status(400).send('fail');
  }

  // 2. Parse the JSON
  let event;
  try {
    event = JSON.parse(webhookBody.toString());
  } catch (err) {
    return res.status(400).send('invalid payload');
  }

  // 3. Handle the event type
  if (event.event === 'payment.captured') {
    const {
      payload: {
        payment: { entity },
      },
    } = event;

    const { order_id, id: paymentId, amount, status } = entity;

    try {
      // Idempotency: only update if still Pending/Initiated
      const fee = await Fee.findOne({
        'paymentDetails.orderId': order_id,
        status: 'Pending',
      });
      if (!fee) {
        console.log(`↩️ Fee already handled for order ${order_id}`);
        return res.status(200).send('ok');
      }

      fee.status = 'Paid';
      fee.paymentDetails = {
        ...fee.paymentDetails.toObject(),
        paymentId,
        signature,
        amountPaid: amount / 100,
        paymentDate: new Date(entity.created_at * 1000),
        status: 'Success',
      };
      await fee.save();

      console.log(`✅ Fee marked Paid for order ${order_id}`);
      return res.status(200).send('ok');
    } catch (err) {
      console.error(err);
      return res.status(500).send('error');
    }
  }

  // 4. Other events (optional)
  return res.status(200).send('ignored');
};
