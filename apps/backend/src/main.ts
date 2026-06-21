import express from 'express';
import * as path from 'path';

import { createTaskModule } from './modules/task/task.module';
import { errorHandlerMiddleware } from './shared/middlewares/error-handler.middleware';
import { createAuditLogModule } from './modules/audit-log/audit-log.module';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

// ── Static Assets ────────────────────────────────────────────────────
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// ── Health Check ─────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ── Module Registration ──────────────────────────────────────────────
const auditLogModule = createAuditLogModule();

const taskModule = createTaskModule({
  auditLogClient: auditLogModule.client,
});
app.use('/api/tasks', taskModule.router);

// ── Error Handler ────────────────────────────────────────────────────
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
