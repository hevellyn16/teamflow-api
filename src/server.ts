import { app } from './app';

const PORT = process.env.PORT || 3333;

app.listen({ port: Number(PORT), host: '0.0.0.0' }).then(() => {
  console.log(`🚀 HTTP server running on http://localhost:${PORT}`);
});