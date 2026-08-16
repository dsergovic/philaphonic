import { Router, type IRouter } from "express";
import healthRouter from "./health";
import feedsRouter from "./feeds";

const router: IRouter = Router();

router.use(healthRouter);
router.use(feedsRouter);

export default router;
