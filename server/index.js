import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import config from "./db/config.js";
import authRoutes from './routes/auth.routes.js';
import assetRoutes from "./routes/asset.routes.js";
import baseRoutes from './routes/base.routes.js';
import transferRoutes from './routes/transfer.routes.js';
import purchaseRoutes from './routes/purchase.routes.js';
import expendituresRoutes from "./routes/expenditure.routes.js"
import assignmnetRoutes from './routes/assignmnet.routes.js'
dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use('/api',authRoutes)
app.use('/api/assets',assetRoutes)
app.use('/api/base',baseRoutes)
app.use('/api/transfer',transferRoutes)
app.use('/api/purchase',purchaseRoutes)
app.use('/api/expenditures',expendituresRoutes)
app.use("/api/assignmnet",assignmnetRoutes)

app.listen(port, () => {
  console.log(`Server is Running in Port: ${port}`);
  config()
});
