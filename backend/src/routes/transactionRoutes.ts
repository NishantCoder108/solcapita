import { Router } from "express";

import { saveTransactionHandler } from "../controllers/transactionController";

const router = Router();

router.post("/save", saveTransactionHandler);

export default router;
