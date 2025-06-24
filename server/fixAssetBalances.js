import mongoose from 'mongoose';
import config from './db/config.js';
import Asset from './models/asset.js';
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

async function fixBalances() {
  await config();
  const assets = await Asset.find();
  let updated = 0;
  for (const asset of assets) {
    const numericQuantity = Number(asset.quantity);
    if (!asset.closingBalance || asset.closingBalance === 0) {
      asset.closingBalance = numericQuantity;
      asset.openingBalance = numericQuantity;
      await asset.save();
      updated++;
      console.log(`Updated asset ${asset.name} (${asset._id}): closingBalance set to ${numericQuantity}`);
    }
  }
  console.log(`Done. Updated ${updated} assets.`);
  process.exit(0);
}

fixBalances().catch(err => {
  console.error('Error updating assets:', err);
  process.exit(1);
}); 