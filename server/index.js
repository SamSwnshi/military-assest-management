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
import dashboardRoutes from './routes/dashboard.routes.js'
import userRoutes from './routes/user.routes.js';
dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes)
app.use('/api/assets',assetRoutes)
app.use('/api/bases',baseRoutes)
app.use('/api/transfers',transferRoutes)
app.use('/api/purchases',purchaseRoutes)
app.use('/api/expenditures',expendituresRoutes)
app.use("/api/assignments",assignmnetRoutes)
app.use('/api/dashboard',dashboardRoutes)
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server is Running in Port: ${port}`);
  config()
});
